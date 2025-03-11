/* eslint-disable no-console */
"use client";

import { useEffect, useRef, useState } from "react";

export default function ResizableComponent() {
  const resizableRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = resizableRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const newHeight = entry.contentRect.height;

      setHeight(newHeight);

      if (newHeight >= 300) {
        console.log("Height reached 300px! Triggering function...");
        triggerAction();
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const triggerAction = () => alert("Height reached 300px!");

  return (
    <div className="flex flex-col items-center">
      <div
        ref={resizableRef}
        className="w-64 min-h-[100px] max-h-[500px] overflow-auto p-4 border-2 border-black resize-y bg-white"
      >
        Resize me (drag bottom-right corner)
      </div>
      <p className="mt-4">Current Height: {height}px</p>
    </div>
  );
}
