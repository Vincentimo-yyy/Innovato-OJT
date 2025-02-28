"use client";
import React from "react";

import { roboto } from "./fonts";

export const TaskCard = ({
  taskName = "....",
  color = "bg-red-800",
}: {
  taskName?: string;
  color?: string;
}) => (
  <div className="py-2 flex justify-center h-[80px] hover:h-[120px] transition-all duration-200">
    <div className="flex w-[260px] border-2 border-gray-300 shadow-md">
      <div className={`${color} w-[10px]`} />
      <div className="flex-1 flex items-center justify-center transition-all duration-200">
        <p
          className={`${roboto.className} font-sans text-center text-[24px] text-gray-800`}
        >
          {taskName}
        </p>
      </div>
    </div>
  </div>
);
