/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import type { Task } from "./borderbox";

import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@heroui/react";
import { format, addDays } from "date-fns";

import { ScheduledTaskList } from "./scheduled-task-list";
import { TaskFormModal, type TaskTimeData } from "./task-form-modal";

interface ScheduledTask {
  taskId: string;
  category?: string;
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

interface DayInfo {
  dayName: string; // MON, TUES, etc.
  dayNumber: string; // Day of month (1-31)
  fullDate: string; // Full date in "MMMM d, yyyy" format
}

interface BorderlessBoxProps {
  scheduledTasks: ScheduledTask[];
  onTaskDrop: (
    taskId: string,
    day: string,
    startHour: number,
    endHour: number,
    taskData?: {
      title: string;
      details: string;
      priority: string;
      color: string;
    },
  ) => void;
  onTaskResize: (taskId: string, newEndHour: number) => void;
  onRetractTask: (taskId: string) => void;
  onEditTask?: (taskData: {
    id: string;
    startHour: number;
    endHour: number;
    day: string;
    task?: Task;
  }) => void;
  dayRange?: "1 Day" | "3 Days" | "1 Week";
}

export default function BorderlessBox({
  scheduledTasks,
  onTaskDrop,
  onTaskResize,
  onRetractTask,
  onEditTask,
  dayRange = "3 Days",
}: BorderlessBoxProps) {
  // Generate days array with full date information based on dayRange
  const days: DayInfo[] = (() => {
    const today = new Date();
    const dayNames = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];

    // Determine number of days to display based on dayRange
    let numDays = 3;

    if (dayRange === "1 Day") numDays = 1;
    else if (dayRange === "1 Week") numDays = 7;

    return Array.from({ length: numDays }, (_, i) => {
      const date = addDays(today, i);

      return {
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate().toString(),
        fullDate: format(date, "MMMM d, yyyy"),
      };
    });
  })();

  const [dropError, setDropError] = useState<{
    day: string;
    hour: number;
  } | null>(null);

  const [containerHeight, setContainerHeight] = useState("calc(100vh - 120px)");
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleDrop = (e: React.DragEvent, fullDate: string, hour: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-100");

    try {
      const taskData = e.dataTransfer.getData("application/json");

      if (taskData) {
        const task = JSON.parse(taskData);
        const duration = task.endHour ? task.endHour - task.startHour : 1;
        const endHour = hour + duration;

        if (!areTimeSlotsAvailable(fullDate, hour, endHour, task.id)) {
          setDropError({ day: fullDate, hour });
          setTimeout(() => setDropError(null), 2000);

          return;
        }

        setEditingTaskData({
          id: task.id,
          startHour: hour,
          endHour: endHour,
          day: fullDate,
        });

        const existingTask = scheduledTasks.find((t) => t.taskId === task.id)
          ?.task || {
          id: task.id,
          title: task.title || "New Task",
          details: task.details || "",
          priority: task.priority || "medium",
          color: task.color || "bg-orange-400",
        };

        setEditingTask(existingTask);
        onOpen();
      }
    } catch (error) {}
  };

  const handleEditTask = (taskData: TaskTimeData) => {
    const scheduledTask = scheduledTasks.find(
      (task) => task.taskId === taskData.id,
    );

    if (scheduledTask) {
      setEditingTaskData(taskData);
      setEditingTask(scheduledTask.task);
      onOpen();
    }
  };

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
      const existingTaskIndex = scheduledTasks.findIndex(
        (task) => task.taskId === editingTaskData.id,
      );

      if (existingTaskIndex !== -1) {
        if (onEditTask) {
          const updatedTask = {
            ...scheduledTasks[existingTaskIndex].task,
            title: formData.title,
            details: formData.details,
            priority: formData.priority,
            color: formData.color,
          };

          onEditTask({
            id: editingTaskData.id,
            startHour:
              formData.startHour !== undefined
                ? formData.startHour
                : scheduledTasks[existingTaskIndex].startHour,
            endHour:
              formData.endHour !== undefined
                ? formData.endHour
                : scheduledTasks[existingTaskIndex].endHour,
            day:
              formData.day !== undefined
                ? formData.day
                : scheduledTasks[existingTaskIndex].day,
            task: updatedTask,
          });
        }
      } else {
        if (editingTaskData.id) {
          const startHour =
            formData.startHour !== undefined
              ? formData.startHour
              : editingTaskData.startHour;
          const endHour =
            formData.endHour !== undefined
              ? formData.endHour
              : editingTaskData.endHour;
          const day =
            formData.day !== undefined ? formData.day : editingTaskData.day;

          if (day && startHour !== undefined && endHour !== undefined) {
            onTaskDrop(editingTaskData.id, day, startHour, endHour, {
              title: formData.title,
              details: formData.details,
              priority: formData.priority,
              color: formData.color,
            });
          }
        }
      }
    }

    onOpenChange();
    setEditingTaskData(null);
    setEditingTask(null);
  };

  const getTimeSlots = (fullDate: string): TimeSlot[] => {
    // Create basic hourly slots
    const hourlySlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
      startHour: i + 1,
      endHour: i + 2,
      tasks: [],
    }));

    // Get tasks for this day
    const dayTasks = scheduledTasks.filter((task) => task.day === fullDate);

    if (dayTasks.length === 0) {
      return hourlySlots;
    }

    // Create a map of slots with tasks
    const result: TimeSlot[] = [];

    for (let hour = 1; hour <= 24; hour++) {
      // Find tasks that start in this hour
      const tasksStartingInThisHour = dayTasks.filter(
        (task) => Math.floor(task.startHour) === hour,
      );

      // Find tasks that overlap this hour but started earlier
      const overlappingTasks = dayTasks.filter(
        (task) => task.startHour < hour && task.endHour > hour,
      );

      // Find tasks that end in this hour but started earlier
      const tasksEndingInThisHour = dayTasks.filter(
        (task) =>
          Math.floor(task.startHour) < hour &&
          Math.floor(task.endHour) === hour,
      );

      if (tasksStartingInThisHour.length > 0) {
        for (const task of tasksStartingInThisHour) {
          if (task.startHour > hour) {
            result.push({
              startHour: hour,
              endHour: task.startHour,
              tasks: [],
            });
          }

          result.push({
            startHour: task.startHour,
            endHour: task.endHour,
            tasks: [task],
          });

          if (Math.floor(task.endHour) === hour && task.endHour < hour + 1) {
            result.push({
              startHour: task.endHour,
              endHour: hour + 1,
              tasks: [],
            });
          }
        }
      } else if (tasksEndingInThisHour.length > 0) {
        for (const task of tasksEndingInThisHour) {
          if (task.endHour < hour + 1) {
            result.push({
              startHour: task.endHour,
              endHour: hour + 1,
              tasks: [],
            });
          }
        }
      } else if (overlappingTasks.length === 0) {
        result.push({
          startHour: hour,
          endHour: hour + 1,
          tasks: [],
        });
      }
    }

    return result;
  };

  const formatTime = (hour: number) => {
    const hourWhole = Math.floor(hour);
    const minutes = Math.round((hour - hourWhole) * 60);
    const period = hourWhole < 12 ? "AM" : hourWhole === 12 ? "PM" : "PM";
    const displayHour = hourWhole <= 12 ? hourWhole : hourWhole - 12;

    const minutesFormatted = minutes.toString().padStart(2, "0");

    return `${displayHour}:${minutesFormatted} ${period}`;
  };

  // Determine the grid columns class based on the number of days
  const gridColumnsClass =
    days.length === 1
      ? "grid-cols-1"
      : days.length === 7
        ? "grid-cols-7"
        : "grid-cols-3";

  return (
    <div
      ref={containerRef}
      className="w-full border-t border-gray-300 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-900"
      style={{ maxHeight: containerHeight }}
    >
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

      <div
        className={`grid ${gridColumnsClass} divide-x divide-gray-300 dark:divide-gray-700`}
      >
        {days.map(({ dayName, dayNumber, fullDate }) => (
          <div key={fullDate} className="flex flex-col">
            <h2 className="text-center text-[18px] dark:text-gray-200">
              {dayName}
            </h2>
            <h2 className="text-center font-semibold text-[32px] leading-none dark:text-gray-100">
              {dayNumber}
            </h2>

            <div className="flex flex-col flex-1">
              {getTimeSlots(fullDate).map((slot) => {
                const isErrorSlot =
                  dropError?.day === fullDate &&
                  dropError?.hour === slot.startHour;
                const hasTask = slot.tasks.length > 0;

                return (
                  <div
                    key={`${fullDate}-${slot.startHour}`}
                    className={`border-t border-gray-300 dark:border-gray-700 text-[12px] text-gray-700 dark:text-gray-300 px-4 py-3 transition-colors bg-white dark:bg-gray-800
                      ${isErrorSlot ? "bg-red-100 dark:bg-red-900" : ""}
                      ${slot.endHour - slot.startHour > 1 ? "min-h-[" + (slot.endHour - slot.startHour) * 60 + "px]" : "min-h-[60px]"}`}
                    onDragLeave={handleDragLeave}
                    onDragOver={!hasTask ? handleDragOver : undefined}
                    onDrop={
                      !hasTask
                        ? (e) => handleDrop(e, fullDate, slot.startHour)
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
                              fullDate,
                              slot.startHour + 1,
                              newEndHour,
                              taskId,
                            )
                          ) {
                            onTaskResize(taskId, newEndHour);
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
