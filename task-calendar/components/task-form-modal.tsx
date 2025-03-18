"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Textarea,
  Select,
  SelectItem,
  Input,
  TimeInput,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { format } from "date-fns";

import { SubmitIcon } from "./icons";
import { taskTypes } from "./borderbox";

// Interface for task time data
export interface TaskTimeData {
  id?: string;
  startHour?: number;
  endHour?: number;
  day?: string;
}

interface TaskFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (taskData: {
    title: string;
    details: string;
    priority: string;
    color: string;
    startHour?: number;
    endHour?: number;
    day?: string;
  }) => void;
  timeEditData?: TaskTimeData | null;
  initialValues?: {
    title?: string;
    details?: string;
    priority?: string;
  };
}

export function TaskFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  timeEditData = null,
  initialValues = {},
}: TaskFormModalProps) {
  const [taskDetails, setTaskDetails] = useState(initialValues.details || "");
  const [taskTitle, setTaskTitle] = useState(initialValues.title || "");
  const [taskPriority, setTaskPriority] = useState(
    initialValues.priority || taskTypes[0].key,
  );

  // Add state for time values
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  const now = new Date();
  const today = format(now, "MMMM d, yyyy");
  const [day, setDay] = useState(timeEditData?.day || today);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      // Only reset the form when the modal first opens
      setTaskTitle(initialValues?.title || "");
      setTaskDetails(initialValues?.details || "");
      setTaskPriority(initialValues?.priority || taskTypes[0].key);

      // Set time values from timeEditData
      if (timeEditData) {
        setDay(timeEditData.day || today);

        if (timeEditData.startHour !== undefined) {
          const startHourWhole = Math.floor(timeEditData.startHour);
          const startMinutes = Math.round(
            (timeEditData.startHour - startHourWhole) * 60,
          );

          setStartTime(new Time(startHourWhole, startMinutes));
        }

        if (timeEditData.endHour !== undefined) {
          const endHourWhole = Math.floor(timeEditData.endHour);
          const endMinutes = Math.round(
            (timeEditData.endHour - endHourWhole) * 60,
          );

          setEndTime(new Time(endHourWhole, endMinutes));
        }
      }
    }
  }, [isOpen]); // Only depend on isOpen, not on the other values

  // Add a separate effect to handle initialValues changes
  useEffect(() => {
    if (isOpen && initialValues) {
      // Update form when initialValues change and modal is open
      if (initialValues.title !== undefined) {
        setTaskTitle(initialValues.title);
      }
      if (initialValues.details !== undefined) {
        setTaskDetails(initialValues.details);
      }
      if (initialValues.priority !== undefined) {
        setTaskPriority(initialValues.priority);
      }
    }
  }, [isOpen, initialValues]);

  // Add a separate effect to handle timeEditData changes
  useEffect(() => {
    if (isOpen && timeEditData) {
      // Update time values when timeEditData changes and modal is open
      setDay(timeEditData.day || today);

      if (timeEditData.startHour !== undefined) {
        const startHourWhole = Math.floor(timeEditData.startHour);
        const startMinutes = Math.round(
          (timeEditData.startHour - startHourWhole) * 60,
        );

        setStartTime(new Time(startHourWhole, startMinutes));
      }

      if (timeEditData.endHour !== undefined) {
        const endHourWhole = Math.floor(timeEditData.endHour);
        const endMinutes = Math.round(
          (timeEditData.endHour - endHourWhole) * 60,
        );

        setEndTime(new Time(endHourWhole, endMinutes));
      }
    }
  }, [isOpen, timeEditData, today]);

  // Function to add new task
  const handleSubmit = () => {
    if (!taskTitle.trim()) return; // Check if title is empty

    // Get priority color
    const taskType =
      taskTypes.find((t) => t.key === taskPriority) || taskTypes[0];

    // Convert Time objects to hour numbers, properly handling minutes
    let startHour: number | undefined = undefined;
    let endHour: number | undefined = undefined;

    if (startTime) {
      startHour = startTime.hour + startTime.minute / 60;
    }

    if (endTime) {
      endHour = endTime.hour + endTime.minute / 60;
    }

    // Submit task through parent component with time data
    onSubmit({
      title: taskTitle,
      details: taskDetails,
      color: taskType.color,
      priority: taskType.key,
      startHour: timeEditData?.startHour !== undefined ? startHour : undefined,
      endHour: timeEditData?.endHour !== undefined ? endHour : undefined,
      day: timeEditData?.day !== undefined ? day : undefined,
    });

    // Reset fields
    setTaskTitle("");
    setTaskDetails("");
    setTaskPriority(taskTypes[0].key);
    setStartTime(null);
    setEndTime(null);
  };

  // Convert hour number to Time object for TimeInput
  const hourToTimeObject = (hour: number) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);

    return new Time(hours, minutes);
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalBody>
          <div className="flex w-[145px] flex-wrap ">
            <Select
              className={`max-w-xs`}
              label="Level of Priority"
              selectedKeys={[taskPriority]}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              {taskTypes.map((taskType) => (
                <SelectItem key={taskType.key}>{taskType.label}</SelectItem>
              ))}
            </Select>
          </div>
          <Input
            className="w-full"
            label="Task Title"
            placeholder="Enter Title"
            type="text" // Changed from "Title" to "text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
            }}
          />
          <Textarea
            className={`w-full`}
            label="Task Description"
            placeholder="Enter task description"
            value={taskDetails}
            onChange={(e) => {
              setTaskDetails(e.target.value);
            }}
          />
          <div className="flex flex-row items-center">
            {/*time edit */}
            <div
              className={`items-center space-x-2 ${timeEditData ? "flex" : "hidden"}`}
            >
              <Input
                isReadOnly
                className="w-[128px] h-[50px]"
                label="Date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              <TimeInput
                className="w-[100px] h-[50px]"
                defaultValue={
                  timeEditData?.startHour
                    ? hourToTimeObject(timeEditData.startHour)
                    : new Time(11, 45)
                }
                hourCycle={12}
                label="Start Time"
                size="sm"
                onChange={setStartTime}
              />
              <p>-</p>
              <TimeInput
                className="w-[100px] h-[50px]"
                defaultValue={
                  timeEditData?.endHour
                    ? hourToTimeObject(timeEditData.endHour)
                    : new Time(11, 45)
                }
                hourCycle={12}
                label="End Time"
                size="sm"
                onChange={setEndTime}
              />
            </div>
            <button
              className="ml-auto w-[25px] h-[25px] rounded-full flex items-center hover:-rotate-45 transition-transform duration-500"
              onClick={handleSubmit}
            >
              <SubmitIcon height="25" width="25" />
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
