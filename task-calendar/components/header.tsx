"use client";
import { Button } from "@heroui/react";

import DropdownComponent from "./userdropdown";

export default function Header() {
  return (
    <header className="flex items-center justify-between pr- pl-7 border-b bord border-gray-300">
      <Button
        isIconOnly
        className="bg-[rgb(186,186,186)] w-[50] h-[50] border-radius-full"
      >
        B
      </Button>
      <DropdownComponent />
    </header>
  );
}
