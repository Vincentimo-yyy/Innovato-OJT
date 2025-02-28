"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";

export default function DropdownComponent() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          <DropdownItem
            key="profile"
            className="h-14 gap-2 font-[arial] text-[12px]"
          >
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">xyz@gmail.com</p>
          </DropdownItem>
          <DropdownItem key="settings" className="text-[12px] font-[arial]">
            Add account
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-[12px] font-[arial]"
            color="danger"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
