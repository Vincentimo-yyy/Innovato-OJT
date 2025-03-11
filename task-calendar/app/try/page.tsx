"use client";

import ResizableComponent from "../../components/resize";

export default function ResizablePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Resizable Element Demo</h1>
      <ResizableComponent />
    </div>
  );
}
