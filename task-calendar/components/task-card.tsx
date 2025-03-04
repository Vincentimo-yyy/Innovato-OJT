"use client";
import type React from "react";

interface TaskCardProps {
  id: string;
  taskTitle: string;
  taskDetails?: string;
  color: string;
}

export function TaskCard({
  id,
  taskTitle,
  taskDetails = "...",
  color,
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
    <div className="py-1 px-2">
      <div
        draggable
        className="group flex w-full max-w-[215px] border-2 border-gray-300 shadow-md rounded-sm cursor-move transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5 transform-gpu"
        onDragStart={handleDragStart}
      >
        <div className={`${color} w-[10px]`} />
        <div className="flex-1 flex items-center justify-center px-2 py-1.5">
          <p className="text-center text-[14px] text-gray-800 truncate w-full group-hover:text-gray-900">
            {taskTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
