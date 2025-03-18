"use client";
import type React from "react";

interface TaskCardProps {
  id: string;
  taskTitle: string;
  taskDetails?: string;
  taskWrapper?: string;
  taskDetailsClassName?: string;
  taskTitleClassName?: string;
  color: string;
  className?: string;
  width?: string;
  height?: string;
}

export function TaskCard({
  id,
  taskTitle,
  taskDetails = "...",
  taskWrapper = "items-center",
  taskDetailsClassName = "hidden",
  taskTitleClassName = "text-center truncate",
  color,
  className = "",
  width = "220px",
  height = "50px",
}: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id,
        title: taskTitle,
        details: taskDetails,
        color,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`py-1 px-2 ${className}`}>
      <div
        draggable
        className={`group flex w-full border-2 border-gray-300 shadow-md rounded-sm cursor-move transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5`}
        style={{ width, height }}
        onDragStart={handleDragStart}
      >
        <div className={`${color} w-[10px]`} />
        <div
          className={`flex-col flex justify-center px-2 py-1.5 ${taskWrapper}`}
        >
          <span
            className={`text-[14px] text-gray-800  group-hover:text-gray-900 ${taskTitleClassName}`}
          >
            {taskTitle}
          </span>
          <p
            className={`text-[12px] text-gray-900 w-full ${taskDetailsClassName}`}
          >
            {taskDetails}
          </p>
        </div>
      </div>
    </div>
  );
}
