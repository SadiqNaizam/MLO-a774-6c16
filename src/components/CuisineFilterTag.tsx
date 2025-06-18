import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming cn is available from shadcn/ui setup

interface CuisineFilterTagProps {
  /** The text label for the filter tag (e.g., "Italian", "Fast Food") */
  label: string;
  /** Whether the tag is currently selected/active */
  isActive: boolean;
  /** Callback function triggered when the tag is clicked. Receives the label of the clicked tag. */
  onClick: (label: string) => void;
  /** Optional additional class names for custom styling */
  className?: string;
}

const CuisineFilterTag: React.FC<CuisineFilterTagProps> = ({
  label,
  isActive,
  onClick,
  className,
}) => {
  console.log(`CuisineFilterTag loaded: ${label}, isActive: ${isActive}`);

  const handleClick = () => {
    onClick(label);
  };

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      className={cn(
        "rounded-full transition-all duration-200 ease-in-out",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Enhanced focus visibility
        isActive ? "shadow-md" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-pressed={isActive} // Accessibility for toggle button state
    >
      {label}
    </Button>
  );
};

export default CuisineFilterTag;