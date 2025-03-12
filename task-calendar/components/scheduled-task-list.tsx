"use client";
import type React from "react";
import type { Task } from "./borderbox";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface ScheduledTask {
  taskId: string;
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

interface ScheduledTaskListProps {
  scheduledTasks: ScheduledTask[];
  onRetractTask: (taskId: string) => void;
  onTaskResize: (taskId: string, newEndHour: number) => void;
}

export function ScheduledTaskList({
  scheduledTasks,
  onRetractTask,
  onTaskResize,
}: ScheduledTaskListProps) {
  const [resizing, setResizing] = useState<string | null>(null);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);
  const currentTask = useRef<ScheduledTask | null>(null);

  // Format time for display
  const formatTimeRange = (startHour: number, endHour: number) => {
    const formatHour = (hour: number) => {
      const period = hour < 12 ? "am" : "pm";
      const displayHour = hour <= 12 ? hour : hour - 12;

      return `${displayHour}${period}`;
    };

    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  };

  // This effect handles the resize move and end events at the component level
  useEffect(() => {
    if (!resizing || !currentTask.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.pageY - startY.current;

      const newHeight = Math.max(52, startHeight.current + deltaY);
      // Calculate how many hours to add based on the height change
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

    // Add event listeners to the window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Clean up
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

    // Store the starting position and task
    startY.current = e.pageY;
    currentTask.current = task;

    const element = e.currentTarget.parentElement;

    if (element) {
      startHeight.current = element.getBoundingClientRect().height;
    }

    // Set the resizing state last to trigger the effect
    setResizing(task.taskId);
  };

  // Keyboard handling for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, task: ScheduledTask) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newEndHour = task.endHour + 1;

      onTaskResize(task.taskId, newEndHour);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newEndHour = Math.max(task.startHour + 1, task.endHour - 1);

      onTaskResize(task.taskId, newEndHour);
    }
  };

  return (
    <div className="flex flex-col space-y-1 mt-1">
      {scheduledTasks.map((scheduledTask) => {
        const duration = scheduledTask.endHour - scheduledTask.startHour;
        const height = duration > 1 ? `${duration * 60 - 8}px` : "auto";

        return (
          <div
            key={scheduledTask.taskId}
            className={`${scheduledTask.task.color} rounded-md p-2 shadow-md text-white flex flex-col justify-between relative`}
            draggable={!resizing}
            style={{ height }}
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

            {/* Show time range for multi-hour tasks */}
            {duration > 1 && (
              <div className="text-xs mt-1 text-white/80">
                {formatTimeRange(
                  scheduledTask.startHour,
                  scheduledTask.endHour,
                )}
              </div>
            )}

            {/* Accessible resize handle */}
            <button
              aria-label="Resize task"
              aria-valuemax={24}
              aria-valuemin={scheduledTask.startHour + 1}
              aria-valuenow={scheduledTask.endHour}
              aria-valuetext={`Task ends at ${scheduledTask.endHour <= 12 ? scheduledTask.endHour : scheduledTask.endHour - 12}${scheduledTask.endHour < 12 ? "am" : "pm"}`}
              className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize hover:bg-white/20 rounded-b-md border-0 p-0 m-0 focus:outline-none focus:bg-white/30"
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, scheduledTask)}
              onMouseDown={(e) => handleResizeStart(e, scheduledTask)}
            />
          </div>
        );
      })}
    </div>
  );
}
