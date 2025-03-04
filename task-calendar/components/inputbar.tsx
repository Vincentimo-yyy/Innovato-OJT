"use client";

import React, { useState } from "react";

import { SubmitIcon } from "./icons";
import { roboto } from "./fonts";

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
        className={`${roboto.className} w-[255px] border border-gray-600 pl-5 py-3 rounded-full`}
        placeholder="Enter text here"
        type="text"
        value={inputValue}
        onChange={handleChange}
      />
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full"
        onClick={handleSubmit}
      >
        <SubmitIcon />
      </button>
    </div>
  );
}
