"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { CustomModal } from "./custom-modal";
import {
  WorkIcon,
  MoneyIcon,
  SchoolIcon,
  TechIcon,
  HomeIcon,
  HealthIcon,
  MusicIcon,
  CameraIcon,
  CodeIcon,
  GameIcon,
  PaletteIcon,
} from "./icons";

// Define project icons with their components
const projectIcons = [
  { id: "briefcase", component: WorkIcon, label: "Work" },
  { id: "money", component: MoneyIcon, label: "Finance" },
  { id: "pencil", component: SchoolIcon, label: "Edit" },
  { id: "tech", component: TechIcon, label: "Technology" },
  { id: "home", component: HomeIcon, label: "Home" },
  { id: "health", component: HealthIcon, label: "Health" },
  { id: "music", component: MusicIcon, label: "Music" },
  { id: "camera", component: CameraIcon, label: "Media" },
  { id: "code", component: CodeIcon, label: "Development" },
  { id: "game", component: GameIcon, label: "Gaming" },
  { id: "palette", component: PaletteIcon, label: "Design" },
];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, iconId: string) => void;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
}: AddCategoryModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const { theme } = useTheme();
  const [iconFill, setIconFill] = useState<string>("#1A1A1A");

  useEffect(() => {
    setIconFill(theme === "dark" ? "white" : "#1A1A1A");
  }, [theme]);

  const getIcon = (IconComponent: React.ComponentType<any>) => {
    return (
      <IconComponent className="w-8 h-8 dark:text-gray-200" fill={iconFill} />
    );
  };

  const handleSave = () => {
    if (projectName.trim() && selectedIcon) {
      onSave(projectName, selectedIcon);
      setProjectName("");
      setSelectedIcon(null);
      onClose();
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="space-y-6">
          {/* Project Name Input */}
          <div>
            <h2 className="text-xl mb-4 dark:text-white">Name your Project</h2>
            <input
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 pb-2 focus:outline-none focus:border-blue-500 bg-transparent dark:text-white"
              placeholder="Enter project name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Icon Selection */}
          <div>
            <h3 className="text-lg mb-4 dark:text-gray-200">
              Choose Project Icon
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {projectIcons.map((icon) => {
                const IconComponent = icon.component;

                return (
                  <button
                    key={icon.id}
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors
                ${
                  selectedIcon === icon.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                    onClick={() => setSelectedIcon(icon.id)}
                  >
                    {getIcon(IconComponent)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className={`px-6 py-2 rounded-full text-white transition-colors
          ${
            !projectName.trim() || !selectedIcon
              ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          }`}
              disabled={!projectName.trim() || !selectedIcon}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
