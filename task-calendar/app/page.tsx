"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import BorderBox, { type Task } from "@/components/borderbox";
import Header, { type TaskCategory, type Project } from "@/components/header";
import BorderlessBox from "@/components/time-table";
import InputBar from "@/components/inputbar";

export interface TaskWithSchedule extends Task {
  isScheduled: boolean;
  category: TaskCategory;
  day?: string;
  startHour?: number;
  endHour?: number;
}

interface TimetableTask {
  taskId: string;
  category: TaskCategory;
  day: string;
  startHour: number;
  endHour: number;
  task: Task;
}

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
  tech: [],
  music: [],
};

// Initial projects for dropdown
const initialProjects: Project[] = [
  {
    project: "Tech",
    icon: "tech",
    tasks: {},
  },
  {
    project: "Music",
    icon: "music",
    tasks: {},
  },
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("home");

  const [allTasksData, setAllTasksData] = useState<
    Record<TaskCategory, TaskWithSchedule[]>
  >(JSON.parse(JSON.stringify(initialCategoryTasksData)));

  const [unscheduledTasks, setUnscheduledTasks] = useState<TaskWithSchedule[]>(
    [],
  );

  const [timetableTasks, setTimetableTasks] = useState<TimetableTask[]>([]);

  const [taskIdCounter, setTaskIdCounter] = useState(4);

  // State for projects - initialize once and don't reset on every render
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Add a ref to access the BorderBox component's methods
  const borderBoxRef = useRef<{
    openModalWithTimeEdit: (taskData?: any) => void;
  } | null>(null);

  // Use useCallback for handlers to prevent recreation on every render
  const handleCategoryChange = useCallback((category: TaskCategory) => {
    setActiveCategory(category);
  }, []);

  // Handle adding a new project from Header
  const handleAddProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project]);

    const projectId = project.project.toLowerCase().replace(/\s+/g, "-");

    setAllTasksData((prev) => ({
      ...prev,
      [projectId]: [],
    }));
  }, []);

  // Update unscheduled tasks and timetable tasks when activeCategory or allTasksData changes
  useEffect(() => {
    setUnscheduledTasks(
      allTasksData[activeCategory]?.filter((task) => !task.isScheduled) || [],
    );

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

  const generateTaskId = useCallback(() => {
    const newId = `${activeCategory}-task-${Date.now()}-${taskIdCounter}`;

    setTaskIdCounter((prev) => prev + 1);

    return newId;
  }, [activeCategory, taskIdCounter]);

  // Add a function to handle task editing
  const handleEditTask = useCallback(
    (taskData: {
      id: string;
      startHour: number;
      endHour: number;
      day: string;
      task?: Task;
    }) => {
      if (taskData.task) {
        let taskCategory: TaskCategory | null = null;

        setAllTasksData((prev) => {
          Object.entries(prev).forEach(([category, tasks]) => {
            if (tasks.some((t) => t.id === taskData.id)) {
              taskCategory = category as TaskCategory;
            }
          });

          if (!taskCategory) return prev;

          const newData = { ...prev };
          const categoryTasks = [...newData[taskCategory]];
          const taskIndex = categoryTasks.findIndex(
            (t) => t.id === taskData.id,
          );

          if (taskIndex !== -1) {
            categoryTasks[taskIndex] = {
              ...categoryTasks[taskIndex],
              title: taskData.task!.title,
              details: taskData.task!.details,
              priority: taskData.task!.priority,
              color: taskData.task!.color,
              day: taskData.day,
              startHour: taskData.startHour,
              endHour: taskData.endHour,
            };

            newData[taskCategory] = categoryTasks;
          }

          return newData;
        });

        return;
      }

      if (borderBoxRef.current) {
        borderBoxRef.current.openModalWithTimeEdit(taskData);
      }
    },
    [],
  );

  // Function for Add a task
  const handleAddTask = useCallback(
    (taskData: Omit<Task, "id">) => {
      const newId = generateTaskId();

      const newTask: TaskWithSchedule = {
        id: newId,
        ...taskData,
        isScheduled: false,
        category: activeCategory,
      };

      setUnscheduledTasks((prev) => [...prev, newTask]);

      setAllTasksData((prev) => ({
        ...prev,
        [activeCategory]: [...(prev[activeCategory] || []), newTask],
      }));
    },
    [activeCategory, generateTaskId],
  );

  // Delete tasks
  const handleDeleteTasks = useCallback(
    (updatedTasks: Task[]) => {
      const convertedTasks = updatedTasks.map((task) => ({
        ...task,
        isScheduled: false,
        category: activeCategory,
      })) as TaskWithSchedule[];

      setUnscheduledTasks(convertedTasks);

      setAllTasksData((prev) => {
        const scheduledTasks =
          prev[activeCategory]?.filter((task) => task.isScheduled) || [];

        return {
          ...prev,
          [activeCategory]: [...convertedTasks, ...scheduledTasks],
        };
      });
    },
    [activeCategory],
  );

  // Handle dropping a task on the timetable
  const handleTaskDrop = useCallback(
    (
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
    ) => {
      setTimetableTasks((prevTimetableTasks) => {
        const existingTask = prevTimetableTasks.find(
          (tt) => tt.taskId === taskId,
        );

        // Time slot lock
        const isTimeSlotOccupied = prevTimetableTasks.some(
          (task) =>
            task.taskId !== taskId &&
            task.day === day &&
            ((task.startHour <= startHour && task.endHour > startHour) ||
              (task.startHour < endHour && task.endHour >= endHour) ||
              (task.startHour >= startHour && task.endHour <= endHour)),
        );

        if (isTimeSlotOccupied) {
          return prevTimetableTasks;
        }

        if (existingTask) {
          // Ability to move task that are scheduled
          setAllTasksData((prev) => {
            const newData = { ...prev };

            const categoryTasks = [...newData[existingTask.category]];
            const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

            if (taskIndex !== -1) {
              categoryTasks[taskIndex] = {
                ...categoryTasks[taskIndex],
                day,
                startHour,
                endHour,
                ...(taskData && {
                  title: taskData.title,
                  details: taskData.details,
                  priority: taskData.priority,
                  color: taskData.color,
                }),
              };

              newData[existingTask.category] = categoryTasks;
            }

            return newData;
          });
        } else {
          setAllTasksData((prev) => {
            let taskCategory: TaskCategory | null = null;
            let taskToSchedule: TaskWithSchedule | null = null;

            // Find the task and its category
            Object.entries(prev).forEach(([category, tasks]) => {
              const task = tasks.find((t) => t.id === taskId);

              if (task) {
                taskCategory = category as TaskCategory;
                taskToSchedule = task;
              }
            });

            if (!taskCategory || !taskToSchedule) return prev;

            const newData = { ...prev };
            const categoryTasks = [...newData[taskCategory]];
            const taskIndex = categoryTasks.findIndex((t) => t.id === taskId);

            if (taskIndex !== -1) {
              categoryTasks[taskIndex] = {
                ...categoryTasks[taskIndex],
                isScheduled: true,
                day,
                startHour,
                endHour,
                ...(taskData && {
                  title: taskData.title,
                  details: taskData.details,
                  priority: taskData.priority,
                  color: taskData.color,
                }),
              };

              newData[taskCategory] = categoryTasks;
            }

            return newData;
          });

          // Find the task category outside the setAllTasksData callback
          let foundTaskCategory: TaskCategory | null = null;

          // Find which category the task belongs to
          Object.entries(allTasksData).forEach(([category, tasks]) => {
            if (tasks.some((t) => t.id === taskId)) {
              foundTaskCategory = category as TaskCategory;
            }
          });

          // Handle task box not reloading the category avoiding duping
          if (foundTaskCategory && activeCategory === foundTaskCategory) {
            setUnscheduledTasks((prev) => prev.filter((t) => t.id !== taskId));
          }
        }

        return prevTimetableTasks;
      });
    },
    [activeCategory, allTasksData],
  );

  // Handle resizing a task in the timetable
  const handleTaskResize = useCallback(
    (taskId: string, newEndHour: number) => {
      const task = timetableTasks.find((t) => t.taskId === taskId);

      if (!task) return;

      // Overlap check
      const isOverlapping = timetableTasks.some(
        (t) =>
          t.taskId !== taskId &&
          t.day === task.day &&
          t.startHour < newEndHour &&
          t.startHour >= task.startHour + 1,
      );

      if (isOverlapping) {
        return;
      }

      // Update time frame
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
    },
    [timetableTasks],
  );

  // Handle returning a task from the timetable to the task list
  const handleReturnTaskToList = useCallback(
    (taskId: string) => {
      const scheduledTask = timetableTasks.find((tt) => tt.taskId === taskId);

      if (!scheduledTask) return;

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

      if (scheduledTask.category === activeCategory) {
      }
    },
    [activeCategory, timetableTasks],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        activeCategory={activeCategory}
        initialProjects={projects}
        onAddProject={handleAddProject}
        onCategoryChange={handleCategoryChange}
      />
      <div className="flex pt-2 w-full pr-5 flex-1 overflow-hidden">
        <div className="flex flex-col">
          <BorderBox
            ref={borderBoxRef}
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
          onEditTask={handleEditTask}
          onRetractTask={handleReturnTaskToList}
          onTaskDrop={handleTaskDrop}
          onTaskResize={handleTaskResize}
        />
      </div>
    </div>
  );
}
