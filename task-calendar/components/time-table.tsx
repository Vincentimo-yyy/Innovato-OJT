"use client";
import React from "react";

import { roboto } from "./fonts";

export default function BorderlessBox() {
  const days = [
    { day: "MON", date: "24" },
    { day: "TUES", date: "25" },
    { day: "WED", date: "26" },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-gray-400 border-t border-gray-400 w-full min-h-fit ">
      {days.map(({ day, date }) => (
        <div key={date} className="flex flex-col">
          <h2 className={`${roboto.className} text-center text-[22px]`}>
            {day}
          </h2>
          <h2
            className={`${roboto.className} text-center font-semibold text-[40px] leading-none`}
          >
            {date}
          </h2>
          <div className="flex flex-col flex-1">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className={`${roboto.className} border-t border-gray-300 text-sm text-gray-700 px-4 py-3`}
              >
                {i < 12 ? i + 1 : i - 11}:00 {i < 11 ? "AM" : "PM"}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
