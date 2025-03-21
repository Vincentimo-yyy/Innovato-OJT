/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { format, parse } from "date-fns";
import { useTheme } from "next-themes";

import { SubmitIcon } from "./icons";
import { taskTypes } from "./borderbox";

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Add state for time values
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  const now = new Date();
  const today = format(now, "MMMM d, yyyy");
  const [, setSelectedDate] = useState<Date | null>(null);
  const [day, setDay] = useState(timeEditData?.day || today);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setTaskTitle(initialValues?.title || "");
      setTaskDetails(initialValues?.details || "");
      setTaskPriority(initialValues?.priority || taskTypes[0].key);

      if (timeEditData) {
        setDay(timeEditData.day || today);

        // Parse the date string to a Date object if it exists
        if (timeEditData.day) {
          try {
            const parsedDate = parse(
              timeEditData.day,
              "MMMM d, yyyy",
              new Date(),
            );

            setSelectedDate(parsedDate);
          } catch (error) {
            setSelectedDate(new Date());
          }
        } else {
          setSelectedDate(new Date());
        }

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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialValues) {
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

  useEffect(() => {
    if (isOpen && timeEditData) {
      setDay(timeEditData.day || today);

      // Parse the date string to a Date object if it exists
      if (timeEditData.day) {
        try {
          const parsedDate = parse(
            timeEditData.day,
            "MMMM d, yyyy",
            new Date(),
          );

          setSelectedDate(parsedDate);
        } catch (error) {
          setSelectedDate(new Date());
        }
      } else {
        setSelectedDate(new Date());
      }

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

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;

    const taskType =
      taskTypes.find((t) => t.key === taskPriority) || taskTypes[0];

    let startHour: number | undefined = undefined;
    let endHour: number | undefined = undefined;

    if (startTime) {
      startHour = startTime.hour + startTime.minute / 60;
    }

    if (endTime) {
      endHour = endTime.hour + endTime.minute / 60;
    }

    onSubmit({
      title: taskTitle,
      details: taskDetails,
      color: taskType.color,
      priority: taskType.key,
      startHour: timeEditData?.startHour !== undefined ? startHour : undefined,
      endHour: timeEditData?.endHour !== undefined ? endHour : undefined,
      day: timeEditData?.day !== undefined ? day : undefined,
    });

    setTaskTitle("");
    setTaskDetails("");
    setTaskPriority(taskTypes[0].key);
    setStartTime(null);
    setEndTime(null);
    setSelectedDate(null);
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
            type="text"
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
          <div className="flex flex-col space-y-4">
            <div
              className={`items-center space-x-2 ${timeEditData ? "flex flex-col space-y-4 sm:flex-row sm:space-y-0" : "hidden"}`}
            >
              <div className="w-full sm:w-auto">
                <Input
                  className="w-full sm:w-[180px]"
                  label="Date"
                  placeholder="MMMM d, yyyy"
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <TimeInput
                  className="w-[100px] h-[50px]"
                  defaultValue={
                    timeEditData?.startHour
                      ? hourToTimeObject(timeEditData.startHour)
                      : new Time(9, 0)
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
                      : new Time(10, 0)
                  }
                  hourCycle={12}
                  label="End Time"
                  size="sm"
                  onChange={setEndTime}
                />
              </div>
            </div>
            <button
              className="ml-auto w-[25px] h-[25px] rounded-full flex items-center hover:-rotate-45 transition-transform duration-500"
              onClick={handleSubmit}
            >
              <SubmitIcon
                fill={mounted && theme === "dark" ? "white" : "black"}
                height="25"
                width="25"
              />
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
