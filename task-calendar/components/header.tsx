/* eslint-disable no-console */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import DropdownComponent from "./userdropdown";
import {
  MenuIcon,
  AddIcon,
  OptionsIcon,
  HomeIcon,
  WorkIcon,
  SchoolIcon,
  MoneyIcon,
  TechIcon,
  HealthIcon,
  MusicIcon,
  CameraIcon,
  CodeIcon,
  GameIcon,
  PaletteIcon,
  Clock12Icon,
  Clock24Icon,
} from "./icons";
import Clock from "./clock";
import { AddCategoryModal } from "./add-project";

export type TaskCategory = "home" | "school" | "work" | string;

// Define the project interface
export interface Project {
  project: string;
  icon: string;
  tasks: Record<string, string>; // { task_1: name, task_2: name }
}

// Define the active button interface
interface ActiveButton {
  id: string;
  name: string;
  icon: string;
}

interface HeaderProps {
  activeCategory: TaskCategory;
  onCategoryChange: (category: TaskCategory) => void;
  onAddProject: (project: Project) => void; // New prop to pass project to parent
  initialProjects?: Project[]; // New prop to receive initial projects from parent
}

// Map of icon IDs to icon components
const iconMap: Record<string, React.ReactNode> = {
  briefcase: <WorkIcon />,
  money: <MoneyIcon />,
  pencil: <SchoolIcon />,
  tech: <TechIcon />,
  home: <HomeIcon />,
  health: <HealthIcon />,
  music: <MusicIcon />,
  camera: <CameraIcon />,
  code: <CodeIcon />,
  game: <GameIcon />,
  palette: <PaletteIcon />,
};

export default function Header({
  activeCategory,
  onCategoryChange,
  onAddProject,
  initialProjects = [],
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [is24Hour, setIs24Hour] = useState<boolean>(false); // Add state for time format

  // Initialize with default buttons
  const [activeButtons, setActiveButtons] = useState<ActiveButton[]>([
    { id: "home", name: "Home", icon: "home" },
    { id: "school", name: "School", icon: "pencil" },
    { id: "work", name: "Work", icon: "briefcase" },
  ]);

  // Initialize projects state with default projects if no initialProjects provided
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.length > 0
      ? initialProjects
      : [
          {
            project: "Tech",
            icon: "tech",
            tasks: {},
          },
          {
            project: "Music",
            icon: "music",
            tasks: {},
          },
        ],
  );

  // Update projects when initialProjects changes
  useEffect(() => {
    if (initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const handleCategoryClick = (buttonId: string) => {
    onCategoryChange(buttonId);
  };

  // Handle selecting a project from the dropdown
  const handleSelectProject = (project: Project) => {
    // Create a new button from the selected project
    const newButton: ActiveButton = {
      id: project.project.toLowerCase().replace(/\s+/g, "-"),
      name: project.project,
      icon: project.icon,
    };

    // Remove the first button (FIFO) and add it back to projects
    const removedButton = activeButtons[0];
    const updatedProjects = [...projects];

    // Remove the selected project from the projects list
    const selectedProjectIndex = projects.findIndex(
      (p) => p.project === project.project,
    );

    if (selectedProjectIndex !== -1) {
      updatedProjects.splice(selectedProjectIndex, 1);
    }

    // Add the removed button back to projects
    const removedProject: Project = {
      project: removedButton.name,
      icon: removedButton.icon,
      tasks: {},
    };

    updatedProjects.push(removedProject);

    // Update the active buttons (remove first, add new at the end)
    const updatedButtons = [...activeButtons.slice(1), newButton];

    setActiveButtons(updatedButtons);
    setProjects(updatedProjects);

    // If the active category was the removed button, change it to the first button in the new list
    if (activeCategory === removedButton.id) {
      onCategoryChange(updatedButtons[0].id);
    }
  };

  const handleSaveCategory = (name: string, iconId: string) => {
    // Create a new project object
    const newProject: Project = {
      project: name,
      icon: iconId,
      tasks: {},
    };

    // Add the new project to the projects array
    setProjects((prevProjects) => [...prevProjects, newProject]);

    // Pass the new project to the parent component
    onAddProject(newProject);

    // Log for debugging
    console.log("New category saved:", newProject);
  };

  return (
    <header className="flex items-center justify-between border-gray-300 px-5">
      {/* Left side menu and buttons remain the same */}
      <div className="relative flex items-center w-[200px]">
        {/* Menu Button */}
        <button
          className="absolute z-30 w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 transition-transform duration-500"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon />
        </button>

        {/* Buttons with Sliding Effect - Now Queue-Based */}
        {activeButtons.map((button, index) => (
          <button
            key={button.id}
            className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full 
              ${activeCategory === button.id ? "bg-blue-200" : "bg-gray-200"} 
              hover:bg-gray-300 transition-transform duration-500`}
            style={{
              transform: isOpen
                ? `translateX(${(index + 1) * 50}px)`
                : "translateX(0px)",
            }}
            title={`${button.name} Tasks`}
            onClick={() => handleCategoryClick(button.id)}
          >
            {iconMap[button.icon]}
          </button>
        ))}

        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(200px)" : "translateX(0px)",
          }}
          title="Add Category"
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          <AddIcon className="w-7 h-7" fill="black" />
        </button>
        <Dropdown>
          <DropdownTrigger>
            <button
              className={`absolute z-10 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-transform duration-500`}
              style={{
                transform: isOpen ? "translateX(250px)" : "translateX(0px)",
              }}
              title="Options"
            >
              <OptionsIcon />
            </button>
          </DropdownTrigger>
          <DropdownMenu>
            {/* Display projects in dropdown */}
            {projects.map((project, index) => (
              <DropdownItem
                key={`project-${index}`}
                onPress={() => handleSelectProject(project)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center">
                    {iconMap[project.icon]}
                  </span>
                  <p>{project.project}</p>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Center: Clock with format toggle button */}
      <div className="flex-1 flex justify-left pl-32 items-center">
        {/* Format toggle button */}
        <button
          aria-label={
            is24Hour ? "Switch to 12-hour format" : "Switch to 24-hour format"
          }
          className="mr-2 transition-transform hover:scale-110 active:scale-95"
          title={
            is24Hour ? "Switch to 12-hour format" : "Switch to 24-hour format"
          }
          onClick={() => setIs24Hour(!is24Hour)}
        >
          {is24Hour ? <Clock12Icon /> : <Clock24Icon />}
        </button>
        <Clock is24Hour={is24Hour} />
      </div>

      {/* Right Side: Dropdown */}
      <div className="ml-auto">
        <DropdownComponent />
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </header>
  );
}
