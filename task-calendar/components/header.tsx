"use client";

import { useState } from "react";

import DropdownComponent from "./userdropdown";
import { MenuIcon } from "./icons";
import Clock from "./clock";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-green-700 hover:bg-gray-300 transition-transform duration-500`}
          style={{ transform: isOpen ? "translateX(60px)" : "translateX(0px)" }}
        >
          1
        </button>
        <button
          className={`absolute z-10 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-orange-500 hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(120px)" : "translateX(0px)",
          }}
        >
          2
        </button>
        <button
          className={`absolute z-0 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-red-600 hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(180px)" : "translateX(0px)",
          }}
        >
          3
        </button>
      </div>
      <div className="flex-1 flex justify-left pl-20">
        <Clock />
      </div>

      {/* Right Side: Dropdown */}
      <div className="ml-auto">
        <DropdownComponent />
      </div>
    </header>
  );
}
