"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useTheme } from "next-themes";

import DropdownComponent from "./userdropdown";
import { ThemeToggle } from "./theme-toggle";
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
  tasks: Record<string, string>;
}

// Define the active button interface
interface ActiveButton {
  id: string;
  name: string;
  icon: string;
}

// interface for day range options
type DayRangeOption = "1 Day" | "3 Days" | "1 Week";

interface HeaderProps {
  activeCategory: TaskCategory;
  onCategoryChange: (category: TaskCategory) => void;
  onAddProject: (project: Project) => void;
  initialProjects?: Project[];
  onDayRangeChange?: (range: DayRangeOption) => void;
}

export default function Header({
  activeCategory,
  onCategoryChange,
  onAddProject,
  initialProjects = [],
  onDayRangeChange,
}: HeaderProps) {
  const [iconFill, setIconFill] = useState<string>("#1A1A1A");
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [selectedDayRange, setSelectedDayRange] =
    useState<DayRangeOption>("3 Days");

  useEffect(() => {
    setIconFill(theme === "dark" ? "white" : "#1A1A1A");
  }, [theme]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "briefcase":
        return <WorkIcon fill={iconFill} />;
      case "money":
        return <MoneyIcon fill={iconFill} />;
      case "pencil":
        return <SchoolIcon fill={iconFill} />;
      case "tech":
        return <TechIcon fill={iconFill} />;
      case "home":
        return <HomeIcon fill={iconFill} />;
      case "health":
        return <HealthIcon fill={iconFill} />;
      case "music":
        return <MusicIcon fill={iconFill} />;
      case "camera":
        return <CameraIcon fill={iconFill} />;
      case "code":
        return <CodeIcon fill={iconFill} />;
      case "game":
        return <GameIcon fill={iconFill} />;
      case "palette":
        return <PaletteIcon fill={iconFill} />;
      default:
        return <HomeIcon fill={iconFill} />;
    }
  };

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

    setProjects((prevProjects) => [...prevProjects, newProject]);

    onAddProject(newProject);
  };
  // Get the active project name based on the activeCategory
  const activeProjectName = useMemo(() => {
    const activeButton = activeButtons.find(
      (button) => button.id === activeCategory,
    );

    if (activeButton) {
      return activeButton.name;
    }

    // If not found in active buttons, check in projects
    const projectId = activeCategory;
    const matchingProject = projects.find(
      (project) =>
        project.project.toLowerCase().replace(/\s+/g, "-") === projectId,
    );

    if (matchingProject) {
      return matchingProject.project;
    }

    // Capitalize first letter as fallback
    return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  }, [activeCategory, activeButtons, projects]);

  // Add handler for day range selection
  const handleDayRangeChange = (range: DayRangeOption) => {
    setSelectedDayRange(range);
    if (onDayRangeChange) {
      onDayRangeChange(range);
    }
  };

  return (
    <header className="flex items-center justify-between border-gray-300 px-5">
      <div className="relative flex items-center w-[200px]">
        {/* Menu Button */}
        <button
          className="absolute z-30 w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform duration-500"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MenuIcon fill={iconFill} />
        </button>

        {activeButtons.map((button, index) => (
          <button
            key={button.id}
            className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full 
              ${activeCategory === button.id ? "bg-blue-200 dark:bg-blue-900" : "bg-gray-200 dark:bg-gray-800"} 
              hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform duration-500`}
            style={{
              transform: isOpen
                ? `translateX(${(index + 1) * 50}px)`
                : "translateX(0px)",
            }}
            title={`${button.name} Tasks`}
            onClick={() => handleCategoryClick(button.id)}
          >
            {getIcon(button.icon)}
          </button>
        ))}

        <button
          className={`absolute z-20 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform duration-500`}
          style={{
            transform: isOpen ? "translateX(200px)" : "translateX(0px)",
          }}
          title="Add Category"
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          <AddIcon className="w-7 h-7" fill={iconFill} />
        </button>
        <Dropdown>
          <DropdownTrigger>
            <button
              className={`absolute z-10 w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform duration-500`}
              style={{
                transform: isOpen ? "translateX(250px)" : "translateX(0px)",
              }}
              title="Options"
            >
              <OptionsIcon fill={iconFill} />
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
                    {getIcon(project.icon)}
                  </span>
                  <p>{project.project}</p>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex-1 flex justify-left pl-32 items-center">
        <button
          aria-label={
            is24Hour ? "Switch to 12-hour format" : "Switch to 24-hour format"
          }
          className="mr-2 transition-transform hover:scale-110 active:scale-95 bg-gray-200 dark:bg-gray-800 p-2 rounded-full"
          title={
            is24Hour ? "Switch to 12-hour format" : "Switch to 24-hour format"
          }
          onClick={() => setIs24Hour(!is24Hour)}
        >
          {is24Hour ? (
            <Clock24Icon fill={iconFill} />
          ) : (
            <Clock12Icon fill={iconFill} />
          )}
        </button>
        <Clock is24Hour={is24Hour} />
        <div className="ml-4">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Project:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {activeProjectName}
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Day range selection dropdown */}
      <div className="mr-16">
        <Dropdown>
          <DropdownTrigger>
            <button className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                {selectedDayRange} <span className="ml-2">▼</span>
              </div>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Day Range Options">
            <DropdownItem
              key="1day"
              className={
                selectedDayRange === "1 Day"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }
              onPress={() => handleDayRangeChange("1 Day")}
            >
              1 Day
            </DropdownItem>
            <DropdownItem
              key="3days"
              className={
                selectedDayRange === "3 Days"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }
              onPress={() => handleDayRangeChange("3 Days")}
            >
              3 Days
            </DropdownItem>
            <DropdownItem
              key="1week"
              className={
                selectedDayRange === "1 Week"
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }
              onPress={() => handleDayRangeChange("1 Week")}
            >
              1 Week
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

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
