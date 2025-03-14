/* eslint-disable no-console */
"use client";
import type React from "react";
import type { Task } from "./borderbox";

import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@heroui/react";

import { ScheduledTaskList } from "./scheduled-task-list";
import { TaskFormModal, type TaskTimeData } from "./task-form-modal";

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

// Update the interface to include the onEditTask prop
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
  onEditTask?: (taskData: {
    id: string;
    startHour: number;
    endHour: number;
    day: string;
    task?: Task;
  }) => void; // We'll keep this for backward compatibility
}

export default function BorderlessBox({
  scheduledTasks,
  onTaskDrop,
  onTaskResize,
  onRetractTask,
  onEditTask,
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

  const [containerHeight, setContainerHeight] = useState("calc(100vh - 120px)");
  const containerRef = useRef<HTMLDivElement>(null);

  // Add state for the task form modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingTaskData, setEditingTaskData] = useState<TaskTimeData | null>(
    null,
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const headerHeight = 80;
        const safetyMargin = 40;
        const availableHeight =
          window.innerHeight - headerHeight - safetyMargin;

        setContainerHeight(`${availableHeight}px`);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

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
        onTaskDrop(task.id, day, hour, endHour);
      }
    } catch (error) {
      console.error("Error parsing dropped task:", error);
    }
  };

  // New function to handle task editing via our own modal
  const handleEditTask = (taskData: TaskTimeData) => {
    // Find the task in scheduledTasks
    const scheduledTask = scheduledTasks.find(
      (task) => task.taskId === taskData.id,
    );

    if (scheduledTask) {
      setEditingTaskData(taskData);
      setEditingTask(scheduledTask.task);
      onOpen();
    }
  };

  // Handle form submission from the modal
  const handleTaskFormSubmit = (formData: {
    title: string;
    details: string;
    priority: string;
    color: string;
    startHour?: number;
    endHour?: number;
    day?: string;
  }) => {
    if (editingTaskData && editingTaskData.id) {
      // Find the task in scheduledTasks
      const taskIndex = scheduledTasks.findIndex(
        (task) => task.taskId === editingTaskData.id,
      );

      if (taskIndex !== -1) {
        // We need to update both the time data and the task content
        if (onEditTask) {
          // Create a merged task with updated properties from the form
          const updatedTask = {
            ...scheduledTasks[taskIndex].task,
            title: formData.title,
            details: formData.details,
            priority: formData.priority,
            color: formData.color,
          };

          // Pass both the time data and updated task to the parent
          onEditTask({
            id: editingTaskData.id,
            startHour:
              formData.startHour !== undefined
                ? formData.startHour
                : scheduledTasks[taskIndex].startHour,
            endHour:
              formData.endHour !== undefined
                ? formData.endHour
                : scheduledTasks[taskIndex].endHour,
            day:
              formData.day !== undefined
                ? formData.day
                : scheduledTasks[taskIndex].day,
            task: updatedTask, // Add the updated task data
          });
        }
      }
    }

    // Close the modal and reset editing state
    onOpenChange();
    setEditingTaskData(null);
    setEditingTask(null);
  };

  // Simplified time slot generation
  const getTimeSlots = (day: string): TimeSlot[] => {
    // Create basic hourly slots
    const hourlySlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
      startHour: i + 1,
      endHour: i + 2,
      tasks: [],
    }));

    // Get tasks for this day
    const dayTasks = scheduledTasks.filter((task) => task.day === day);

    if (dayTasks.length === 0) {
      return hourlySlots;
    }

    // Create a map of slots with tasks
    const result: TimeSlot[] = [];

    // Process each hour
    for (let hour = 1; hour <= 24; hour++) {
      // Find tasks that start in this hour
      const tasksStartingInThisHour = dayTasks.filter(
        (task) => Math.floor(task.startHour) === hour,
      );

      // Find tasks that overlap this hour but started earlier
      const overlappingTasks = dayTasks.filter(
        (task) => task.startHour < hour && task.endHour > hour,
      );

      if (tasksStartingInThisHour.length > 0) {
        // Handle tasks that start in this hour
        for (const task of tasksStartingInThisHour) {
          // If task starts after the hour, add a gap slot
          if (task.startHour > hour) {
            result.push({
              startHour: hour,
              endHour: task.startHour,
              tasks: [],
            });
          }

          // Add the task slot
          result.push({
            startHour: task.startHour,
            endHour: task.endHour,
            tasks: [task],
          });

          // If task ends with a partial hour, add a slot to the next hour
          if (Math.floor(task.endHour) === hour && task.endHour < hour + 1) {
            result.push({
              startHour: task.endHour,
              endHour: hour + 1,
              tasks: [],
            });
          }
        }
      } else if (overlappingTasks.length === 0) {
        // No tasks in this hour, add a regular hourly slot
        result.push({
          startHour: hour,
          endHour: hour + 1,
          tasks: [],
        });
      }
      // Skip hours that are completely covered by tasks
    }

    return result;
  };

  const formatTime = (hour: number) => {
    const hourWhole = Math.floor(hour);
    const minutes = Math.round((hour - hourWhole) * 60);
    const period = hourWhole < 12 ? "AM" : hourWhole === 12 ? "PM" : "PM";
    const displayHour = hourWhole <= 12 ? hourWhole : hourWhole - 12;

    // Format minutes with leading zero
    const minutesFormatted = minutes.toString().padStart(2, "0");

    return `${displayHour}:${minutesFormatted} ${period}`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full border-t border-gray-300 overflow-y-auto bg-white"
      style={{ maxHeight: containerHeight }}
    >
      {/* Task Form Modal */}
      <TaskFormModal
        initialValues={
          editingTask
            ? {
                title: editingTask.title,
                details: editingTask.details,
                priority: editingTask.priority,
              }
            : undefined
        }
        isOpen={isOpen}
        timeEditData={editingTaskData}
        onOpenChange={onOpenChange}
        onSubmit={handleTaskFormSubmit}
      />

      <div className="grid grid-cols-3 divide-x divide-gray-300">
        {days.map(({ day, date }) => (
          <div key={date} className="flex flex-col">
            <h2 className="text-center text-[18px]">{day}</h2>
            <h2 className="text-center font-semibold text-[32px] leading-none">
              {date}
            </h2>

            <div className="flex flex-col flex-1">
              {getTimeSlots(day).map((slot) => {
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
                        onEditTask={handleEditTask}
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
