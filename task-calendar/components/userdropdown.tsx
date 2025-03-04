"use client";
import React from "react";
import { Avatar } from "@heroui/react";

import { DropdownIcon } from "./icons";

export default function DropdownComponent() {
  return (
    <div className="flex items-center pr-6 pt-4">
      {/* Shared hover effect container */}
      <div className="flex items-center gap-2 hover:bg-gray-300 transition p-2 rounded-full">
        {/* Dropdown Icon (Left) */}
        <div className="w-[25px] h-[25px] flex items-center justify-center rounded-xl">
          <DropdownIcon />
        </div>
        {/* Avatar (Right) */}
        <Avatar
          showFallback
          className="w-[40px] h-[40px]"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
      </div>
    </div>
  );
}
