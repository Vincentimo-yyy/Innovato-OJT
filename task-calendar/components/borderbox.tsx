"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";

import { roboto } from "./fonts";
import { TaskCard } from "./task-card";
import { AddIcon, SubmitIcon } from "./icons";

export const taskTypes = [
  { label: "Task", key: "task" },
  { label: "Meeting", key: "meeting" },
  { label: "Reminder", key: "reminder" },
  { label: "Deadline", key: "deadline" },
  { label: "Event", key: "event" },
  { label: "Other", key: "other" },
];
export default function BorderBox() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="px-6">
      <div className="w-[300px] border-2 border-gray-300 shadow-md rounded-lg p-4 relative h-[680px]">
        <p
          className={`${roboto.className} text-center text-[24px] text-gray-700 border-b-2 border-gray-300 pb-2`}
        >
          Task
        </p>

        {/* Task List */}
        <div className="space-y-3 mt-3">
          <TaskCard color="bg-yellow-300" />
          <TaskCard color="bg-green-400" />
          <TaskCard />
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
          size="3xl"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalHeader className={`${roboto.className}`}>
              <div className="flex w-[125px] flex-wrap md:flex-nowrap gap-4">
                <Select className={`max-w-xs`} label="Type of Task">
                  {taskTypes.map((taskTypes) => (
                    <SelectItem
                      key={taskTypes.key}
                      className={`${roboto.className}`}
                    >
                      {taskTypes.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalHeader>
            <ModalBody>
              <Textarea
                className={`w-full ${roboto.className}`}
                label="Task Description"
                placeholder="Enter task description"
              />
            </ModalBody>
            <ModalFooter>
              <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <SubmitIcon />
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
