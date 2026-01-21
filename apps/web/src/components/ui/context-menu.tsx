import * as React from "react";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    // Adjust position to keep menu within viewport
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x;
      let adjustedY = y;

      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }
      if (adjustedX < 0) adjustedX = 10;
      if (adjustedY < 0) adjustedY = 10;

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Use a small delay to prevent immediate closing
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    document.addEventListener("keydown", handleEscape);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-[200px] rounded-md border border-gray-200 bg-white shadow-lg py-0.5"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
}

export function ContextMenuItem({
  className,
  disabled,
  variant = "default",
  children,
  ...props
}: ContextMenuItemProps) {
  return (
    <button
      className={cn(
        "w-full px-2.5 py-1 text-left text-xs transition-colors whitespace-nowrap",
        "hover:bg-gray-100",
        disabled && "text-gray-400 cursor-not-allowed hover:bg-transparent",
        variant === "primary" && "text-blue-600 font-medium",
        variant === "danger" && "text-red-600",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function ContextMenuSeparator() {
  return <div className="h-px bg-gray-200 my-0.5" />;
}
