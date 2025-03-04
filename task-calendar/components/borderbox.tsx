"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";

import { TaskCard } from "./task-card";
import { AddIcon, SubmitIcon } from "./icons";

export const taskTypes = [
  { label: "Low", key: "low", color: "bg-green-400" },
  { label: "Medium", key: "medium", color: "bg-orange-400" },
  { label: "High", key: "high", color: "bg-red-600" },
];

export interface Task {
  id: string;
  title: string;
  details: string;
  color: string;
}

interface BorderBoxProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
}

export default function BorderBox({ tasks, onAddTask }: BorderBoxProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [taskDetails, setTaskDetails] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState(taskTypes[0].key);

  // Function to add new task
  const addTask = () => {
    if (!taskTitle.trim()) return; // Don't allow empty tasks

    // Get priority color
    const taskType =
      taskTypes.find((t) => t.key === taskPriority) || taskTypes[0];

    // Add task through parent component
    onAddTask({
      title: taskTitle,
      details: taskDetails,
      color: taskType.color,
    });

    // Reset fields & close modal
    setTaskTitle("");
    setTaskDetails("");
    setTaskPriority(taskTypes[0].key);
    onOpenChange();
  };

  return (
    <div className="px-6">
      <div className="w-[240px] border-2 border-gray-300 shadow-md rounded-lg p-4 relative h-[550px]">
        <p
          className={`text-center text-[24px] text-gray-700 border-b-2 border-gray-300 pb-2`}
        >
          Task
        </p>

        {/* Task List */}
        <div className="space-y-1 mt-1 overflow-y-auto max-h-[420px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              color={task.color}
              id={task.id}
              taskDetails={task.details}
              taskTitle={task.title}
            />
          ))}
        </div>

        {/* Add Task Button */}
        <button
          className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center hover:bg-green-600 absolute bottom-5 right-5"
          onClick={onOpen}
        >
          <AddIcon />
        </button>

        {/* Modal */}
        <Modal
          isOpen={isOpen}
          placement="top-center"
          size="2xl"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalBody>
              <div className="flex w-[145px] flex-wrap ">
                <Select
                  className={`max-w-xs`}
                  label="Level of Priority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  {taskTypes.map((taskType) => (
                    <SelectItem key={taskType.key}>{taskType.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <Input
                className="w-[300px]"
                label="Task Title"
                placeholder="Enter Title"
                type="Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Textarea
                className={`w-full`}
                label="Task Description"
                placeholder="Enter task description"
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
              />
              <div className="flex justify-end ">
                <button
                  className="w-[40px] h-[40px] rounded-full flex items-center"
                  onClick={addTask}
                >
                  <SubmitIcon height="35" width="35" />
                </button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
