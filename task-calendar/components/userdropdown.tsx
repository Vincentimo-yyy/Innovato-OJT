"use client";
import React from "react";
import { Avatar } from "@heroui/react";

import { DropdownIcon } from "./icons";

export default function DropdownComponent() {
  return (
    <div className="flex items-center pr-6 pt-4">
      {/* Shared hover effect container */}
      <div className="flex items-center gap-2 hover:bg-gray-300 transition p-2 rounded-xl">
        {/* Dropdown Icon (Left) */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl">
          <DropdownIcon />
        </div>
        {/* Avatar (Right) */}
        <Avatar
          showFallback
          className="w-[50px] h-[50px]"
          src="https://images.unsplash.com/broken"
        />
      </div>
    </div>
  );
}
