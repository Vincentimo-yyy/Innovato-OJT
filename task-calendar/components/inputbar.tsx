"use client";

import React, { useState } from "react";

import { SubmitIcon } from "./icons";
import { inter } from "./fonts";

export default function InputBar() {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // wala pa ginagawa dito XD
    // eslint-disable-next-line no-console
    console.log("Submitted:", inputValue);
  };

  return (
    <div className="flex items-center gap-1">
      <input
        className={`${inter.className} w-[207px] h-[45px] border border-gray-600 pl-5 py-2 rounded-full`}
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
