"use client";
import { useState } from "react";

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

  const generateId = () => {
    const newId = `task-${Date.now()}-${taskIdCounter}`;

    setTaskIdCounter((prevCounter) => prevCounter + 1);

    return newId;
  };

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
    };

    setTasks([...tasks, newTask]);
  };

  const handleTaskDrop = (taskId: string, day: string, hour: number) => {
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const existingSchedule = scheduledTasks.find((st) => st.taskId === taskId);

    if (existingSchedule) {
      setScheduledTasks(
        scheduledTasks.map((st) =>
          st.taskId === taskId ? { ...st, day, hour } : st,
        ),
      );
    } else {
      setScheduledTasks([...scheduledTasks, { taskId, day, hour, task }]);
      setTasks(tasks.filter((t) => t.id !== taskId));
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
          <BorderBox tasks={tasks} onAddTask={handleAddTask} />
          <div className="pt-2 pl-6">
            <InputBar />
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
