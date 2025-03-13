/* eslint-disable no-console */
"use client";
import { useState, useEffect } from "react";

import BorderBox, { type Task } from "@/components/borderbox";
import Header, { type TaskCategory } from "@/components/header";
import BorderlessBox from "@/components/time-table";
import InputBar from "@/components/inputbar";

// Base task interface
export interface TaskWithSchedule extends Task {
  isScheduled: boolean;
  category: TaskCategory;
  day?: string;
  startHour?: number;
  endHour?: number;
}

// Scheduled task representation for the timetable
interface TimetableTask {
  taskId: string;
  category: TaskCategory;
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

// Task database simulation - initial data
const initialCategoryTasksData: Record<TaskCategory, TaskWithSchedule[]> = {
  home: [
    {
      id: "home-task-1",
      title: "Clean Kitchen",
      priority: "medium",
      details: "Clean the kitchen counters and do the dishes",
      color: "bg-orange-400",
      isScheduled: false,
      category: "home",
    },
    {
      id: "home-task-2",
      title: "Laundry",
      priority: "low",
      details: "Wash and fold clothes",
      color: "bg-green-400",
      isScheduled: false,
      category: "home",
    },
    {
      id: "home-task-3",
      title: "Pay Bills",
      priority: "high",
      details: "Pay electricity and water bills",
      color: "bg-red-600",
      isScheduled: false,
      category: "home",
    },
  ],
  work: [
    {
      id: "work-task-1",
      title: "Complete Project",
      priority: "high",
      details: "Finish the project documentation and submit for review",
      color: "bg-red-600",
      isScheduled: false,
      category: "work",
    },
    {
      id: "work-task-2",
      title: "Team Meeting",
      priority: "medium",
      details: "Weekly team sync to discuss progress and blockers",
      color: "bg-orange-400",
      isScheduled: false,
      category: "work",
    },
    {
      id: "work-task-3",
      title: "Research",
      priority: "low",
      details: "Research new technologies for upcoming sprint",
      color: "bg-green-400",
      isScheduled: false,
      category: "work",
    },
  ],
  school: [
    {
      id: "school-task-1",
      title: "Math Homework",
      priority: "high",
      details: "Complete calculus problems for tomorrow's class",
      color: "bg-red-600",
      isScheduled: false,
      category: "school",
    },
    {
      id: "school-task-2",
      title: "Study Group",
      priority: "medium",
      details: "Meet with study group for upcoming exam",
      color: "bg-orange-400",
      isScheduled: false,
      category: "school",
    },
    {
      id: "school-task-3",
      title: "Research Paper",
      priority: "low",
      details: "Start research for term paper due next month",
      color: "bg-green-400",
      isScheduled: false,
      category: "school",
    },
  ],
};

export default function LandingPage() {
  // Active category state
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("home");

  // All tasks data - this is our single source of truth
  const [allTasksData, setAllTasksData] = useState<
    Record<TaskCategory, TaskWithSchedule[]>
  >(JSON.parse(JSON.stringify(initialCategoryTasksData)));

  // Current category's unscheduled tasks (for display in the task list)
  const [unscheduledTasks, setUnscheduledTasks] = useState<TaskWithSchedule[]>(
    [],
  );

  // All scheduled tasks across all categories (for display in the timetable)
  const [timetableTasks, setTimetableTasks] = useState<TimetableTask[]>([]);

  // Task ID counter for generating unique IDs
  const [taskIdCounter, setTaskIdCounter] = useState(4);

  // Update displayed tasks whenever active category or all tasks data changes
  useEffect(() => {
    // Get unscheduled tasks for the current category
    setUnscheduledTasks(
      allTasksData[activeCategory].filter((task) => !task.isScheduled),
    );

    // Get all scheduled tasks from all categories
    const scheduledTasks: TimetableTask[] = [];

    Object.entries(allTasksData).forEach(([, tasks]) => {
      tasks.forEach((task) => {
        if (
          task.isScheduled &&
          task.day &&
          task.startHour !== undefined &&
          task.endHour !== undefined
        ) {
          scheduledTasks.push({
            taskId: task.id,
            category: task.category,
            day: task.day,
            startHour: task.startHour,
            endHour: task.endHour,
            task: {
              id: task.id,
              title: task.title,
              details: task.details,
              priority: task.priority,
              color: task.color,
            },
          });
        }
      });
    });

    setTimetableTasks(scheduledTasks);
  }, [activeCategory, allTasksData]);

  // Generate a unique task ID
  const generateTaskId = () => {
    const newId = `${activeCategory}-task-${Date.now()}-${taskIdCounter}`;

    setTaskIdCounter((prev) => prev + 1);

    return newId;
  };

  // Handle category change
  const handleCategoryChange = (category: TaskCategory) => {
    setActiveCategory(category);
  };

  // Add a new task
  const handleAddTask = (taskData: Omit<Task, "id">) => {
    const newTask: TaskWithSchedule = {
      id: generateTaskId(),
      ...taskData,
      isScheduled: false,
      category: activeCategory,
    };

    // Add to local unscheduled tasks
    setUnscheduledTasks((prev) => [...prev, newTask]);

    // Add to all tasks data
    setAllTasksData((prev) => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newTask],
    }));
  };

  // Delete tasks
  const handleDeleteTasks = (updatedTasks: Task[]) => {
    // Convert to TaskWithSchedule
    const convertedTasks = updatedTasks.map((task) => ({
      ...task,
      isScheduled: false,
      category: activeCategory,
    })) as TaskWithSchedule[];

    // Update local unscheduled tasks
    setUnscheduledTasks(convertedTasks);

    // Update all tasks data - keep scheduled tasks and replace unscheduled ones
    setAllTasksData((prev) => {
      const scheduledTasks = prev[activeCategory].filter(
        (task) => task.isScheduled,
      );

      return {
        ...prev,
        [activeCategory]: [...convertedTasks, ...scheduledTasks],
      };
    });
  };

  // Handle dropping a task on the timetable
  const handleTaskDrop = (
    taskId: string,
    day: string,
    startHour: number,
    endHour: number,
  ) => {
    // Check if task is already in timetable
    const existingTask = timetableTasks.find((tt) => tt.taskId === taskId);

    // Check if time slot is available
    const isTimeSlotOccupied = timetableTasks.some(
      (task) =>
        task.taskId !== taskId && // Don't check against itself
        task.day === day &&
        ((task.startHour <= startHour && task.endHour > startHour) || // Overlaps with start
          (task.startHour < endHour && task.endHour >= endHour) || // Overlaps with end
          (task.startHour >= startHour && task.endHour <= endHour)), // Contained within
    );

    if (isTimeSlotOccupied) {
      console.log("Cannot place task: time slot(s) already occupied");

      return;
    }

    if (existingTask) {
      // Task is already scheduled, just update its position
      setAllTasksData((prev) => {
        const newData = { ...prev };

        // Find the task in its category and update it
        const categoryTasks = [...newData[existingTask.category]];
        const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

        if (taskIndex !== -1) {
          categoryTasks[taskIndex] = {
            ...categoryTasks[taskIndex],
            day,
            startHour,
            endHour,
          };

          newData[existingTask.category] = categoryTasks;
        }

        return newData;
      });
    } else {
      // Find which category the task belongs to
      let taskCategory: TaskCategory | null = null;
      let taskToSchedule: TaskWithSchedule | null = null;

      // Look through all categories to find the task
      Object.entries(allTasksData).forEach(([category, tasks]) => {
        const task = tasks.find((t) => t.id === taskId);

        if (task) {
          taskCategory = category as TaskCategory;
          taskToSchedule = task;
        }
      });

      if (taskCategory && taskToSchedule) {
        // Update the task in its category
        setAllTasksData((prev) => {
          const newData = { ...prev };
          const categoryTasks = [...newData[taskCategory!]];
          const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

          if (taskIndex !== -1) {
            categoryTasks[taskIndex] = {
              ...categoryTasks[taskIndex],
              isScheduled: true,
              day,
              startHour,
              endHour,
            };

            newData[taskCategory!] = categoryTasks;
          }

          return newData;
        });

        // If the task is from the current category, remove it from unscheduled tasks
        if (taskCategory === activeCategory) {
          setUnscheduledTasks((prev) => prev.filter((t) => t.id !== taskId));
        }
      }
    }
  };

  // Handle resizing a task in the timetable
  const handleTaskResize = (taskId: string, newEndHour: number) => {
    const task = timetableTasks.find((t) => t.taskId === taskId);

    if (!task) return;

    // Check if the new size would overlap with other tasks
    const isOverlapping = timetableTasks.some(
      (t) =>
        t.taskId !== taskId && // Don't check against itself
        t.day === task.day &&
        t.startHour < newEndHour &&
        t.startHour >= task.startHour + 1,
    );

    if (isOverlapping) {
      console.log("Cannot resize task: would overlap with another task");

      return;
    }

    // Update the task in its category
    setAllTasksData((prev) => {
      const newData = { ...prev };
      const categoryTasks = [...newData[task.category]];
      const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

      if (taskIndex !== -1) {
        categoryTasks[taskIndex] = {
          ...categoryTasks[taskIndex],
          endHour: Math.max(task.startHour + 1, newEndHour),
        };

        newData[task.category] = categoryTasks;
      }

      return newData;
    });
  };

  // Handle returning a task from the timetable to the task list
  const handleReturnTaskToList = (taskId: string) => {
    const scheduledTask = timetableTasks.find((tt) => tt.taskId === taskId);

    if (!scheduledTask) return;

    // Update the task in its category
    setAllTasksData((prev) => {
      const newData = { ...prev };
      const categoryTasks = [...newData[scheduledTask.category]];
      const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

      if (taskIndex !== -1) {
        categoryTasks[taskIndex] = {
          ...categoryTasks[taskIndex],
          isScheduled: false,
          day: undefined,
          startHour: undefined,
          endHour: undefined,
        };

        newData[scheduledTask.category] = categoryTasks;
      }

      return newData;
    });

    // If the task belongs to the current category, add it to unscheduled tasks
    if (scheduledTask.category === activeCategory) {
      const taskData = allTasksData[scheduledTask.category].find(
        (t) => t.id === taskId,
      );

      if (taskData) {
        setUnscheduledTasks((prev) => [
          ...prev,
          {
            ...taskData,
            isScheduled: false,
            day: undefined,
            startHour: undefined,
            endHour: undefined,
          },
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div className="flex pt-2 w-full pr-5 flex-1 overflow-hidden">
        <div className="flex flex-col">
          <BorderBox
            tasks={unscheduledTasks}
            onAddTask={handleAddTask}
            onDeleteTasks={handleDeleteTasks}
          />
          <div className="pt-4 pl-6">
            <InputBar onAddTask={handleAddTask} />
          </div>
        </div>
        <BorderlessBox
          scheduledTasks={timetableTasks}
          onRetractTask={handleReturnTaskToList}
          onTaskDrop={handleTaskDrop}
          onTaskResize={handleTaskResize}
        />
      </div>
    </div>
  );
}
