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
    <div className="w-full border-t border-gray-400 overflow-y-auto max-h-[calc(100vh-100px)]">
      <div className="grid grid-cols-3 divide-x divide-gray-400">
        {days.map(({ day, date }) => (
          <div key={date} className="flex flex-col">
            {/* Day and Date */}
            <h2 className={`${roboto.className} text-center text-[22px]`}>
              {day}
            </h2>
            <h2
              className={`${roboto.className} text-center font-semibold text-[40px] leading-none`}
            >
              {date}
            </h2>

            {/* Time Slots */}
            <div className="flex flex-col flex-1">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i + 1;
                const period = hour < 12 ? "AM" : hour === 12 ? "NN" : "PM";

                return (
                  <div
                    key={i}
                    className={`${roboto.className} border-t border-gray-300 text-sm text-gray-700 px-4 py-3`}
                  >
                    {hour <= 12 ? hour : hour - 12}:00 {period}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
