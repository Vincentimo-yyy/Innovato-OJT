"use client";

import type React from "react";

import { useState, useEffect } from "react";

interface ClockProps {
  className?: string;
}

const Clock: React.FC<ClockProps> = ({ className = "" }) => {
  const [time, setTime] = useState<string>("");
  const [period, setPeriod] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Get hours in 12-hour format
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      // Determine AM/PM
      const ampm = hours >= 12 ? "PM" : "AM";

      setPeriod(ampm);

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      setTime(`${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`);
    };

    updateClock(); // Set initial time
    const interval = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Prevent hydration mismatch

  const timeParts = time.split(":");

  return (
    <div
      className={`flex flex-row items-center gap-1 p-3 bg-gray-200 rounded-lg shadow-md max-h-[90px] ${className}`}
    >
      <span className="text-blue-500 text-3xl">🕒</span>
      <div className="flex gap-1 text-lg font-mono">
        {timeParts.map((unit, index) => (
          <div key={index} className="flex flex-col items-center leading-none">
            <div className="bg-gray-300 px-2 rounded-md w-10 text-center">
              {unit}
            </div>
            <span className="text-[14px] text-gray-600">
              {["hr", "min", "sec"][index]}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center leading-none">
          <div className="bg-gray-300 px-2 rounded-md w-10 text-center">
            {period}
          </div>
          <span className="text-[14px] text-gray-600 invisible">period</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;
