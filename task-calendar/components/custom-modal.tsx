"use client";
import type React from "react";

import { CloseIcon } from "./icons";

export const CustomModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-300"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};
