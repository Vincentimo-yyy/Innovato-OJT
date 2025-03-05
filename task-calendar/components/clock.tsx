"use client";

import { useState, useEffect } from "react";

interface ClockProps {
  className?: string;
}

const Clock: React.FC<ClockProps> = ({ className = "" }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
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
            <div className="bg-gray-300 px-2 rounded-md w-8">{unit}</div>
            <span className="text-[14px] text-gray-600">
              {["hr", "min", "sec"][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
