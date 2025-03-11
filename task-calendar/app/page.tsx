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
  hour: number;
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

  const handleTaskDrop = (taskId: string, day: string, hour: number) => {
    const existingScheduledTaskIndex = scheduledTasks.findIndex(
      (st) => st.taskId === taskId,
    );

    if (existingScheduledTaskIndex !== -1) {
      // Task is already scheduled, just update its position
      setScheduledTasks(
        scheduledTasks.map((st, index) =>
          index === existingScheduledTaskIndex ? { ...st, day, hour } : st,
        ),
      );
    } else {
      // Task is coming from the BorderBox
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        setScheduledTasks([...scheduledTasks, { taskId, day, hour, task }]);
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    }
  };

  const handleRetractTask = (taskId: string) => {
    const scheduledTask = scheduledTasks.find((st) => st.taskId === taskId);

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
          <div className="pt-2 pl-6">
            <InputBar onAddTask={handleAddTask} />
          </div>
        </div>
        <BorderlessBox
          scheduledTasks={scheduledTasks}
          onRetractTask={handleRetractTask}
          onTaskDrop={handleTaskDrop}
        />
      </div>
    </div>
  );
}
