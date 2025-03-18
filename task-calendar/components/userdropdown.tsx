"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { DropdownIcon, LogoutIcon, AddAccountIcon } from "./icons";

export default function DropdownComponent() {
  return (
    <div className="flex items-center pr-6 pt-4">
      {/* Shared hover effect container */}
      <div className="flex items-center gap-2 hover:bg-gray-300 transition p-2 rounded-full">
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2">
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
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Username</p>
            </DropdownItem>
            <DropdownItem key="add_account">
              <div className="flex items-center gap-2">
                <AddAccountIcon />
                <p>Add Account</p>
              </div>
            </DropdownItem>
            <DropdownItem key="logout">
              <div className="flex items-center gap-2">
                <LogoutIcon />
                <p>Logout</p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
