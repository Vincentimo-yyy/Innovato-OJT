/* eslint-disable no-console */
"use client";
import { useState, useEffect } from "react";

import BorderBox, { type Task } from "@/components/borderbox";
import Header from "@/components/header";
import BorderlessBox from "@/components/time-table";
import InputBar from "@/components/inputbar";

interface ScheduledTask {
  taskId: string;
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

export default function LandingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks_data");
      const data = await res.json();

      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const generateId = () => {
    const newId = `task-${Date.now()}-${taskIdCounter}`;

    setTaskIdCounter((prevCounter) => prevCounter + 1);

    return newId;
  };

  const handleAddTask = async (taskData: Omit<Task, "id">) => {
    const taskdb: Task = {
      id: generateId(),
      ...taskData,
    };

    try {
      const res = await fetch("/api/tasks_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskdb),
      });

      const newTask = await res.json();

      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleDeleteTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks); // Update the tasks state
  };

  function extractHours(timeRange: string): {
    startHour: number;
    endHour: number;
  } {
    const match = timeRange.match(/^(\d+):\d+\s*-\s*(\d+):\d+/);

    if (!match) {
      throw new Error("Invalid time range format");
    }

    const startHour = parseInt(match[1], 10);
    const endHour = parseInt(match[2], 10);

    return { startHour, endHour };
  }

  const handleTaskDrop = (
    taskId: string,
    day: string,
    startHour: number,
    endHour: number,
  ) => {
    const existingScheduledTaskIndex = scheduledTasks.findIndex(
      (st) => st.taskId === taskId,
    );

    // Check if any time slot in the range is already occupied by another task
    const isRangeOccupied = scheduledTasks.some(
      (task) =>
        task.taskId !== taskId && // Don't check against itself
        task.day === day &&
        ((task.startHour <= startHour && task.endHour > startHour) || // Overlaps with start
          (task.startHour < endHour && task.endHour >= endHour) || // Overlaps with end
          (task.startHour >= startHour && task.endHour <= endHour)), // Contained within
    );

    if (isRangeOccupied) {
      console.log("Cannot place task: time slot(s) already occupied");

      return;
    }

    if (existingScheduledTaskIndex !== -1) {
      // Task is already scheduled, just update its position
      setScheduledTasks(
        scheduledTasks.map((st, index) =>
          index === existingScheduledTaskIndex
            ? { ...st, day, startHour, endHour }
            : st,
        ),
      );
    } else {
      // Task is coming from the BorderBox
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        setScheduledTasks([
          ...scheduledTasks,
          { taskId, day, startHour, endHour, task },
        ]);
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    }
  };

  const handleTaskResize = (taskId: string, newEndHour: number) => {
    const task = scheduledTasks.find((t) => t.taskId === taskId);

    if (!task) return;

    // Check if the new size would overlap with other tasks
    const isRangeOccupied = scheduledTasks.some(
      (t) =>
        t.taskId !== taskId && // Don't check against itself
        t.day === task.day &&
        t.startHour < newEndHour &&
        t.startHour >= task.startHour + 1,
    );

    if (isRangeOccupied) {
      console.log("Cannot resize task: would overlap with another task");

      return;
    }

    setScheduledTasks((prev) =>
      prev.map((t) =>
        t.taskId === taskId
          ? { ...t, endHour: Math.max(t.startHour + 1, newEndHour) }
          : t,
      ),
    );
  };

  const handleRetractTask = async (taskId: string) => {
    const scheduledTask = scheduledTasks.find((st) => st.taskId === taskId);
    const taskData = { id: taskId, day: null, time_range: null };

    try {
      const response = await fetch("/api/tasks_data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error updating task:", error);
    }

    if (!scheduledTask) return;

    // Remove from scheduled tasks
    setScheduledTasks(scheduledTasks.filter((st) => st.taskId !== taskId));

    // Add back to unscheduled tasks
    setTasks([...tasks, scheduledTask.task]);
  };

  return (
    <div>
      <Header />
      <div className="flex pt-2 w-full pr-5">
        <div className="flex flex-col">
          <BorderBox
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTasks={handleDeleteTasks}
          />
          <div className="pt-4 pl-6">
            <InputBar onAddTask={handleAddTask} />
          </div>
        </div>
        <BorderlessBox
          scheduledTasks={scheduledTasks}
          onRetractTask={handleRetractTask}
          onTaskDrop={handleTaskDrop}
          onTaskResize={handleTaskResize}
        />
      </div>
    </div>
  );
}
