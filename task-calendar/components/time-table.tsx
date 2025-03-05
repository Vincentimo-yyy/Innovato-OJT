/* eslint-disable no-console */
"use client";
import type React from "react";
import type { Task } from "./borderbox";

import { ArrowLeft } from "lucide-react";

interface BorderlessBoxProps {
  scheduledTasks: {
    taskId: string;
    day: string;
    hour: number;
    task: Task;
  }[];
  onTaskDrop: (taskId: string, day: string, hour: number) => void;
  onRetractTask: (taskId: string) => void;
}

export default function BorderlessBox({
  scheduledTasks,
  onTaskDrop,
  onRetractTask,
}: BorderlessBoxProps) {
  const days = [
    { day: "MON", date: "24" },
    { day: "TUES", date: "25" },
    { day: "WED", date: "26" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-gray-100");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-gray-100");
  };

  const handleDrop = (e: React.DragEvent, day: string, hour: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-100");

    try {
      const taskData = e.dataTransfer.getData("application/json");

      if (taskData) {
        const task = JSON.parse(taskData);

        onTaskDrop(task.id, day, hour);
      }
    } catch (error) {
      console.error("Error parsing dropped task:", error);
    }
  };

  const findScheduledTasks = (day: string, hour: number) => {
    return scheduledTasks.filter(
      (scheduledTask) =>
        scheduledTask.day === day && scheduledTask.hour === hour,
    );
  };

  return (
    <div className="w-full border-t border-gray-300 overflow-y-auto max-h-[calc(100vh-80px)]">
      <div className="grid grid-cols-3 divide-x divide-gray-300">
        {days.map(({ day, date }) => (
          <div key={date} className="flex flex-col">
            <h2 className="text-center text-[18px]">{day}</h2>
            <h2 className="text-center font-semibold text-[32px] leading-none">
              {date}
            </h2>

            <div className="flex flex-col flex-1">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i + 1;
                const period = hour < 12 ? "AM" : hour === 12 ? "NN" : "PM";
                const scheduledTasks = findScheduledTasks(day, hour);

                return (
                  <div
                    key={`${day}-${hour}`}
                    className="border-t border-gray-300 text-[12px] text-gray-700 px-4 py-3 min-h-[60px] relative transition-colors"
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                    <div className="font-medium">
                      {hour <= 12 ? hour : hour - 12}:00 {period}
                    </div>

                    <div className="flex flex-col space-y-1 mt-1">
                      {scheduledTasks.map((scheduledTask) => (
                        <div
                          key={scheduledTask.taskId}
                          draggable
                          className={`${scheduledTask.task.color} rounded-md p-2 shadow-md text-white flex justify-between items-center cursor-move`}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.setData(
                              "application/json",
                              JSON.stringify({
                                id: scheduledTask.taskId,
                                title: scheduledTask.task.title,
                                details: scheduledTask.task.details,
                                color: scheduledTask.task.color,
                              }),
                            );
                            e.dataTransfer.effectAllowed = "move";
                          }}
                        >
                          <p className="font-medium text-xs truncate">
                            {scheduledTask.task.title}
                          </p>
                          <button
                            aria-label="Retract task"
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetractTask(scheduledTask.taskId);
                            }}
                          >
                            <ArrowLeft size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
