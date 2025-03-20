"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { SubmitIcon } from "./icons";
import { inter } from "./fonts";

interface InputBarProps {
  onAddTask: (task: {
    title: string;
    details: string;
    color: string;
    priority: string;
  }) => void;
}

export default function InputBar({ onAddTask }: InputBarProps) {
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const newTask = {
      title: inputValue,
      details: "...",
      color: "bg-gray-500",
      priority: "no priority",
    };

    onAddTask(newTask);

    setInputValue("");
  };

  // Determine the fill color based on the theme
  const iconFill = mounted && theme === "dark" ? "white" : "black";

  return (
    <div className="flex items-center gap-1">
      <input
        className={`${inter.className} w-[267px] h-[45px] border border-gray-600 dark:border-gray-500 pl-5 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
        placeholder="Enter text here"
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
      <button
        className="w-8 h-9 flex items-center justify-center rounded-full hover:-rotate-45 transition-transform duration-500"
        onClick={handleSubmit}
      >
        <SubmitIcon fill={iconFill} />
      </button>
    </div>
  );
}
