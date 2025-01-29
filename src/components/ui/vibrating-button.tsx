import { Button } from "@/components/ui/button";
import { triggerVibration } from "@/lib/vibration";
import { motion } from "framer-motion";
import { ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const VibratingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, children, className, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerVibration();
      onClick?.(e);
    };

    return (
      <motion.div
        className="w-full flex items-center  justify-center"  // Add this to make motion.div full width
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button 
          ref={ref} 
          onClick={handleClick} 
          className={`${className}`}  // Keep original className
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

VibratingButton.displayName = "VibratingButton";
