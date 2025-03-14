/* eslint-disable no-console */
"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useDisclosure, Checkbox } from "@heroui/react";

import { TaskFormModal, type TaskTimeData } from "./task-form-modal";
import { TaskCard } from "./task-card";
import { AddIcon, ExpandIcon, ArchiveIcon, DeleteIcon } from "./icons";
import { CustomModal } from "./custom-modal";

export const taskTypes = [
  { label: "Low", key: "low", color: "bg-green-400" },
  { label: "Medium", key: "medium", color: "bg-orange-400" },
  { label: "High", key: "high", color: "bg-red-600" },
];

export interface Task {
  id: string;
  title: string;
  details: string;
  priority: string;
  color: string;
}

// Add timeEditToggle state
// Modify the props interface to include the new function
interface BorderBoxProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onDeleteTasks: (updatedTasks: Task[]) => void;
  openModalWithTimeEdit?: () => void; // Add this prop
}

// Export the openModalWithTimeEdit function
export type { BorderBoxProps };

const BorderBox = forwardRef<
  { openModalWithTimeEdit: (taskData?: TaskTimeData) => void },
  BorderBoxProps
>(({ tasks, onAddTask, onDeleteTasks }, ref) => {
  const {
    isOpen: isAddTaskOpen,
    onOpen: onAddTaskOpen,
    onOpenChange: onAddTaskOpenChange,
  } = useDisclosure();
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editingTaskData, setEditingTaskData] = useState<TaskTimeData | null>(
    null,
  );

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]); // Unselect all
    } else {
      setSelectedTasks(tasks.map((task) => task.id)); // Select all
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(
      (prevSelected) =>
        prevSelected.includes(taskId)
          ? prevSelected.filter((id) => id !== taskId) // Unselect
          : [...prevSelected, taskId], // Select
    );
  };

  const deleteSelectedTasks = () => {
    // Update local state after deletion
    const updatedTasks = tasks.filter(
      (task) => !selectedTasks.includes(task.id),
    );

    setSelectedTasks([]); // Clear selection
    onDeleteTasks(updatedTasks); // Pass new list to parent
  };

  // Expose the openModalWithTimeEdit function via ref
  useImperativeHandle(ref, () => ({
    openModalWithTimeEdit: (taskData?: TaskTimeData) => {
      setEditingTaskData(taskData ?? null);
      // If we have task data, we could also pre-fill the task details
      if (taskData?.id) {
        const task = tasks.find((t) => t.id === taskData.id);

        if (task) {
          // We'll pass the task data to the modal
          onAddTaskOpen();
        }
      } else {
        onAddTaskOpen();
      }
    },
  }));

  // Find the task being edited (if any)
  const editingTask = editingTaskData?.id
    ? tasks.find((t) => t.id === editingTaskData.id)
    : undefined;

  return (
    <div className="px-6">
      <div
        className="w-[300px] border-2 border-gray-300 shadow-md rounded-lg p-4 relative"
        style={{ height: "calc(103vh - 180px)" }}
      >
        <div
          className="absolute top-2 right-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button onClick={() => setIsExpandedOpen(true)}>
            <ExpandIcon fillOpacity={isHovered ? "1" : "0.5"} />
          </button>
        </div>
        <p className="text-center text-[24px] text-gray-700 border-b-2 border-gray-300 pb-2">
          Task
        </p>

        {/* Task List */}
        <div
          className="space-y-1 mt-1 overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: "calc(100% - 80px)" }}
        >
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-row">
              <TaskCard
                color={task.color}
                id={task.id}
                taskDetails={task.details}
                taskTitle={
                  task.title.split(" ").length > 2
                    ? task.title.split(" ").slice(0, 2).join(" ") + "..."
                    : task.title
                }
              />
              <button
                onClick={() =>
                  onDeleteTasks(tasks.filter((t) => t.id !== task.id))
                }
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <button
          className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-green-600 absolute bottom-5 right-5"
          onClick={onAddTaskOpen}
        >
          <AddIcon />
        </button>

        {/* Task Form Modal - now using our new component */}
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
          isOpen={isAddTaskOpen}
          timeEditData={editingTaskData}
          onOpenChange={onAddTaskOpenChange}
          onSubmit={onAddTask}
        />

        <CustomModal
          isOpen={isExpandedOpen}
          onClose={() => setIsExpandedOpen(false)}
        >
          <div className="flex flex-col w-[40vw] h-[80vh]">
            {/* Title Section - FIXED */}
            <h2 className="text-xl font-semibold border-b-2 pb-2">
              List of Tasks
            </h2>

            {/* Scrollable Task List */}
            <div className="flex-1 overflow-y-auto  px-4 mt-2">
              <div className="pt-4 flex space-x-2 items-center">
                <Checkbox
                  isSelected={selectedTasks.length === tasks.length}
                  radius="none"
                  onChange={toggleSelectAll}
                />
                <button>
                  <ArchiveIcon />
                </button>
                <button onClick={deleteSelectedTasks}>
                  <DeleteIcon />
                </button>
              </div>

              {/* Task List */}
              <div className="pt-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center mb-2">
                    <Checkbox
                      isSelected={selectedTasks.includes(task.id)}
                      radius="none"
                      onChange={() => toggleTaskSelection(task.id)}
                    />
                    <TaskCard
                      className=""
                      color={task.color}
                      height="100px"
                      id={task.id}
                      taskDetails={task.details}
                      taskDetailsClassName="block"
                      taskTitle={task.title}
                      taskTitleClassName="font-semibold"
                      taskWrapper="w-full"
                      width="530px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CustomModal>
      </div>
    </div>
  );
});

BorderBox.displayName = "BorderBox";

export default BorderBox;
