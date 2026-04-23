'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-white/10 rounded-lg overflow-hidden ${className}`}>
      <div className="relative p-4">
        <div className="flex-1 text-left pr-12">{title}</div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          <ChevronDown
            className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          {children}
        </div>
      )}
    </div>
  );
}
