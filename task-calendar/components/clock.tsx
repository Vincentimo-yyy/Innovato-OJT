"use client";

import type React from "react";

import { useState, useEffect } from "react";

interface ClockProps {
  className?: string;
  is24Hour: boolean;
}

const Clock: React.FC<ClockProps> = ({ className = "", is24Hour }) => {
  const [time, setTime] = useState<string>("");
  const [period, setPeriod] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      if (is24Hour) {
        // 24-hour format
        const hours = now.getHours().toString().padStart(2, "0");

        setTime(`${hours}:${minutes}:${seconds}`);
        setPeriod("");
      } else {
        // 12-hour format
        let hours = now.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;

        setTime(`${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`);
        setPeriod(ampm);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [is24Hour]);

  if (!time) return null;

  const timeParts = time.split(":");

  return (
    <div
      className={`flex flex-row items-center gap-3 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md max-h-[90px] ${className}`}
    >
      <div className="flex gap-1 text-lg font-mono">
        {timeParts.map((unit, index) => (
          <div key={index} className="flex flex-col items-center leading-none">
            <div className="bg-gray-300 dark:bg-gray-700 px-2 rounded-md w-10 text-center dark:text-gray-200">
              {unit}
            </div>
            <span className="text-[14px] text-gray-600 dark:text-gray-400">
              {["hr", "min", "sec"][index]}
            </span>
          </div>
        ))}
        {!is24Hour && (
          <div className="flex flex-col items-center leading-none">
            <div className="bg-gray-300 dark:bg-gray-700 px-2 rounded-md w-10 text-center dark:text-gray-200">
              {period}
            </div>
            <span className="text-[14px] text-gray-600 dark:text-gray-400 invisible">
              period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clock;
