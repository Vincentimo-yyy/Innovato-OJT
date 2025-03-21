"use client";

import type React from "react";
import type { Task } from "./borderbox";
import type { TaskTimeData } from "./task-form-modal";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface ScheduledTask {
  taskId: string;
  category?: string;
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

interface ScheduledTaskListProps {
  scheduledTasks: ScheduledTask[];
  onRetractTask: (taskId: string) => void;
  onTaskResize: (taskId: string, newEndHour: number) => void;
  onEditTask?: (taskData: TaskTimeData & { task?: Task }) => void;
}

export function ScheduledTaskList({
  scheduledTasks,
  onRetractTask,
  onTaskResize,
  onEditTask,
}: ScheduledTaskListProps) {
  const [resizing, setResizing] = useState<string | null>(null);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);
  const currentTask = useRef<ScheduledTask | null>(null);

  // This effect handles the resize move and end events at the component level
  useEffect(() => {
    if (!resizing || !currentTask.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.pageY - startY.current;

      const newHeight = Math.max(52, startHeight.current + deltaY);
      const hourDelta = Math.floor((newHeight - 52) / 60);
      const newEndHour = currentTask.current!.startHour + 1 + hourDelta;

      if (newEndHour !== currentTask.current!.endHour) {
        onTaskResize(resizing, newEndHour);
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
      currentTask.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, onTaskResize]);

  const handleResizeStart = (e: React.MouseEvent, task: ScheduledTask) => {
    if (!task?.taskId) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    startY.current = e.pageY;
    currentTask.current = task;

    const element = e.currentTarget.parentElement;

    if (element) {
      startHeight.current = element.getBoundingClientRect().height;
    }

    setResizing(task.taskId);
  };

  // Get category badge color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "home":
        return "bg-blue-200 text-blue-800";
      case "work":
        return "bg-purple-200 text-purple-800";
      case "school":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col space-y-1 mt-1">
      {scheduledTasks.map((scheduledTask) => {
        const duration = scheduledTask.endHour - scheduledTask.startHour;
        const height = duration > 1 ? `${duration * 60 - 8}px` : "auto";
        const categoryColor = getCategoryColor(scheduledTask.category);

        return (
          <div
            key={scheduledTask.taskId}
            className={`${scheduledTask.task.color} rounded-md p-2 shadow-md text-white flex flex-col justify-between relative`}
            draggable={!resizing}
            style={{ height }}
            onDoubleClick={() =>
              onEditTask &&
              onEditTask({
                id: scheduledTask.taskId,
                startHour: scheduledTask.startHour,
                endHour: scheduledTask.endHour,
                day: scheduledTask.day,
                task: scheduledTask.task,
              })
            }
            onDragStart={(e) => {
              if (resizing) {
                e.preventDefault();

                return;
              }
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({
                  id: scheduledTask.taskId,
                  title: scheduledTask.task.title,
                  details: scheduledTask.task.details,
                  color: scheduledTask.task.color,
                  startHour: scheduledTask.startHour,
                  endHour: scheduledTask.endHour,
                }),
              );
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="font-medium text-xs truncate">
                  {scheduledTask.task.title}
                </p>
                {scheduledTask.category && (
                  <span
                    className={`text-[10px] px-1 rounded mt-1 inline-block ${categoryColor}`}
                  >
                    {scheduledTask.category}
                  </span>
                )}
              </div>
              <button
                aria-label="Retract task"
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetractTask(scheduledTask.taskId);
                }}
              >
                <ArrowLeft size={15} />
              </button>
            </div>

            <button
              aria-label="Resize task"
              aria-valuemax={24}
              aria-valuemin={scheduledTask.startHour + 1}
              aria-valuenow={scheduledTask.endHour}
              aria-valuetext={`Task ends at ${scheduledTask.endHour <= 12 ? scheduledTask.endHour : scheduledTask.endHour - 12}${scheduledTask.endHour < 12 ? "am" : "pm"}`}
              className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize hover:bg-white/20 rounded-b-md border-0 p-0 m-0 focus:outline-none focus:bg-white/30"
              role="slider"
              tabIndex={0}
              onMouseDown={(e) => handleResizeStart(e, scheduledTask)}
            />
          </div>
        );
      })}
    </div>
  );
}
