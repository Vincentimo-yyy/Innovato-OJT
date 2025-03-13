"use client";

import { useState } from "react";

import DropdownComponent from "./userdropdown";
import {
  MenuIcon,
  AddIcon,
  OptionsIcon,
  HomeIcon,
  WorkIcon,
  SchoolIcon,
} from "./icons";
import Clock from "./clock";

export type TaskCategory = "home" | "school" | "work";

interface HeaderProps {
  activeCategory: TaskCategory;
  onCategoryChange: (category: TaskCategory) => void;
}

export default function Header({
  activeCategory,
  onCategoryChange,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: TaskCategory) => {
    onCategoryChange(category);
  };

  return (
    <header className="flex items-center justify-between border-gray-300 px-5">
      <div className="relative flex items-center w-[200px]">
        {/* Menu Button */}
        <button
          className="absolute z-30 w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition-transform duration-500"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon />
        </button>

        {/* Buttons with Sliding Effect */}
        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full ${activeCategory === "home" ? "bg-blue-200" : "bg-gray-200"} hover:bg-gray-300 transition-transform duration-500`}
          style={{ transform: isOpen ? "translateX(50px)" : "translateX(0px)" }}
          title="Home Tasks"
          onClick={() => handleCategoryClick("home")}
        >
          <HomeIcon />
        </button>
        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full ${activeCategory === "school" ? "bg-blue-200" : "bg-gray-200"} hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(100px)" : "translateX(0px)",
          }}
          title="School Tasks"
          onClick={() => handleCategoryClick("school")}
        >
          <SchoolIcon />
        </button>
        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full ${activeCategory === "work" ? "bg-blue-200" : "bg-gray-200"} hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(150px)" : "translateX(0px)",
          }}
          title="Work Tasks"
          onClick={() => handleCategoryClick("work")}
        >
          <WorkIcon />
        </button>
        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(200px)" : "translateX(0px)",
          }}
          title="Add Category"
        >
          <AddIcon className="w-7 h-7" fill="black" />
        </button>
        <button
          className={`absolute z-10 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(250px)" : "translateX(0px)",
          }}
          title="Options"
        >
          <OptionsIcon />
        </button>
      </div>
      <div className="flex-1 flex justify-left pl-32">
        <Clock />
      </div>

      {/* Right Side: Dropdown */}
      <div className="ml-auto">
        <DropdownComponent />
      </div>
    </header>
  );
}
