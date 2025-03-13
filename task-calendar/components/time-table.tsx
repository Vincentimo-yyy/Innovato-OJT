/* eslint-disable no-console */
"use client";
import type React from "react";
import type { Task } from "./borderbox";

import { useState, useEffect, useRef } from "react";

import { ScheduledTaskList } from "./scheduled-task-list";

interface ScheduledTask {
  taskId: string;
  category?: string; // Added category to display in the UI
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

interface TimeSlot {
  startHour: number;
  endHour: number;
  tasks: ScheduledTask[];
}

interface BorderlessBoxProps {
  scheduledTasks: ScheduledTask[];
  onTaskDrop: (
    taskId: string,
    day: string,
    startHour: number,
    endHour: number,
  ) => void;
  onTaskResize: (taskId: string, newEndHour: number) => void;
  onRetractTask: (taskId: string) => void;
}

export default function BorderlessBox({
  scheduledTasks,
  onTaskDrop,
  onTaskResize,
  onRetractTask,
}: BorderlessBoxProps) {
  const days = [
    { day: "MON", date: "24" },
    { day: "TUES", date: "25" },
    { day: "WED", date: "26" },
  ];

  const [dropError, setDropError] = useState<{
    day: string;
    hour: number;
  } | null>(null);

  // Add this near the top of the component, after other useState declarations
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 120px)");
  const containerRef = useRef<HTMLDivElement>(null);

  // Add this useEffect to handle resize and initial sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const headerHeight = 80; // Approximate header height
        const safetyMargin = 40; // Extra margin to account for bookmarks bar and other browser UI
        const availableHeight =
          window.innerHeight - headerHeight - safetyMargin;

        setContainerHeight(`${availableHeight}px`);
      }
    };

    // Initial calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-gray-100");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-gray-100");
    setDropError(null);
  };

  // Check if a time slot is occupied
  const isTimeSlotOccupied = (day: string, hour: number, taskId?: string) => {
    return scheduledTasks.some(
      (task) =>
        task.day === day &&
        task.startHour <= hour &&
        task.endHour > hour &&
        (taskId ? task.taskId !== taskId : true),
    );
  };

  // Check if a range of time slots is available
  const areTimeSlotsAvailable = (
    day: string,
    startHour: number,
    endHour: number,
    taskId?: string,
  ) => {
    for (let hour = startHour; hour < endHour; hour++) {
      if (isTimeSlotOccupied(day, hour, taskId)) {
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent, day: string, hour: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-100");

    try {
      const taskData = e.dataTransfer.getData("application/json");

      if (taskData) {
        const task = JSON.parse(taskData);
        const duration = task.endHour ? task.endHour - task.startHour : 1;
        const endHour = hour + duration;

        if (!areTimeSlotsAvailable(day, hour, endHour, task.id)) {
          console.log(`⚠️ Cannot drop task: Time slot(s) already occupied`);
          setDropError({ day, hour });
          setTimeout(() => setDropError(null), 2000);

          return;
        }

        // Update UI state directly without database call
        onTaskDrop(task.id, day, hour, endHour);
      }
    } catch (error) {
      console.error("Error parsing dropped task:", error);
    }
  };

  // New function to merge time slots for tasks
  const getMergedTimeSlots = (day: string): TimeSlot[] => {
    const dayTasks = scheduledTasks.filter((task) => task.day === day);
    const slots: TimeSlot[] = [];
    let currentHour = 1;

    while (currentHour <= 24) {
      const tasksStartingAtThisHour = dayTasks.filter(
        (task) => task.startHour === currentHour,
      );

      if (tasksStartingAtThisHour.length > 0) {
        // Get the longest task starting at this hour
        const longestTask = tasksStartingAtThisHour.reduce((prev, current) =>
          current.endHour - current.startHour > prev.endHour - prev.startHour
            ? current
            : prev,
        );

        slots.push({
          startHour: currentHour,
          endHour: longestTask.endHour,
          tasks: tasksStartingAtThisHour,
        });

        // Skip the hours covered by this task
        currentHour = longestTask.endHour;
      } else {
        // If no task starts here, check if we're in the middle of a task
        const overlappingTask = dayTasks.find(
          (task) => task.startHour < currentHour && task.endHour > currentHour,
        );

        if (overlappingTask) {
          // Skip this hour as it's part of an existing task
          currentHour++;
          continue;
        }

        // Add an empty slot
        slots.push({
          startHour: currentHour,
          endHour: currentHour + 1,
          tasks: [],
        });
        currentHour++;
      }
    }

    return slots;
  };

  // Format the time for display
  const formatTime = (hour: number) => {
    const period = hour < 12 ? "AM" : hour === 12 ? "PM" : "PM";
    const displayHour = hour <= 12 ? hour : hour - 12;

    return `${displayHour}:00 ${period}`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full border-t border-gray-300 overflow-y-auto bg-white"
      style={{ maxHeight: containerHeight }}
    >
      <div className="grid grid-cols-3 divide-x divide-gray-300">
        {days.map(({ day, date }) => (
          <div key={date} className="flex flex-col">
            <h2 className="text-center text-[18px]">{day}</h2>
            <h2 className="text-center font-semibold text-[32px] leading-none">
              {date}
            </h2>

            <div className="flex flex-col flex-1">
              {getMergedTimeSlots(day).map((slot) => {
                const isErrorSlot =
                  dropError?.day === day && dropError?.hour === slot.startHour;
                const hasTask = slot.tasks.length > 0;

                return (
                  <div
                    key={`${day}-${slot.startHour}`}
                    className={`border-t border-gray-300 text-[12px] text-gray-700 px-4 py-3 transition-colors bg-white
                      ${isErrorSlot ? "bg-red-100" : ""}
                      ${slot.endHour - slot.startHour > 1 ? "min-h-[" + (slot.endHour - slot.startHour) * 60 + "px]" : "min-h-[60px]"}`}
                    onDragLeave={handleDragLeave}
                    onDragOver={!hasTask ? handleDragOver : undefined}
                    onDrop={
                      !hasTask
                        ? (e) => handleDrop(e, day, slot.startHour)
                        : undefined
                    }
                  >
                    <div className="font-medium">
                      {formatTime(slot.startHour)} - {formatTime(slot.endHour)}
                    </div>

                    {slot.tasks.length > 0 && (
                      <ScheduledTaskList
                        scheduledTasks={slot.tasks}
                        onRetractTask={onRetractTask}
                        onTaskResize={(taskId, newEndHour) => {
                          if (
                            areTimeSlotsAvailable(
                              day,
                              slot.startHour + 1,
                              newEndHour,
                              taskId,
                            )
                          ) {
                            onTaskResize(taskId, newEndHour);
                          } else {
                            console.log(
                              `⚠️ Cannot resize: Would overlap with another task`,
                            );
                          }
                        }}
                      />
                    )}
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
