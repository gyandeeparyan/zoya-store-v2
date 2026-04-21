'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none border border-gray-700`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 border-t border-l rotate-45'
                : position === 'bottom'
                  ? 'bottom-full left-1/2 -translate-x-1/2 border-b border-r -rotate-45'
                  : position === 'left'
                    ? 'left-full top-1/2 -translate-y-1/2 border-l border-b rotate-45'
                    : 'right-full top-1/2 -translate-y-1/2 border-r border-t -rotate-45'
            }`}
          ></div>
        </div>
      )}
    </div>
  );
}
