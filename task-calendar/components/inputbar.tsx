"use client";

import React, { useState } from "react";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return; // Prevent empty input

    const newTask = {
      title: "...",
      details: inputValue,
      color: "bg-white",
      priority: "no priority",
    };

    onAddTask(newTask); // Call the function passed from BorderBox

    setInputValue(""); // Clear input after adding task
  };

  return (
    <div className="flex items-center gap-1">
      <input
        className={`${inter.className} w-[267px] h-[45px] border border-gray-600 pl-5 py-2 rounded-full`}
        placeholder="Enter text here"
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
      <button
        className="w-8 h-9 flex items-center justify-center rounded-full hover:-rotate-45 transition-transform duration-500"
        onClick={handleSubmit}
      >
        <SubmitIcon />
      </button>
    </div>
  );
}
