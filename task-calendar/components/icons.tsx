"use client";

export const SubmitIcon = ({
  fill = "white", // White icon for contrast
  ...props
}) => {
  return (
    <svg
      className="w-9 h-9"
      fill="currentColor"
      stroke={fill}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
};

export const MenuIcon = ({
  fill = "black", // White icon for contrast
  ...props
}) => {
  return (
    <svg
      className="w-9 h-9"
      fill="currentColor"
      stroke={fill}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
};

export const DropdownIcon = ({
  fill = "none", // White icon for contrast
  ...props
}) => {
  return (
    <svg
      className="w-9 h-9"
      fill="currentColor"
      stroke={fill}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" />
    </svg>
  );
};

export const AddIcon = ({
  fill = "white", // White icon for contrast
  ...props
}) => {
  return (
    <svg
      className="w-9 h-9"
      fill="currentColor"
      stroke={fill}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
};
