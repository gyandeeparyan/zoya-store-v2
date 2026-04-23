"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavigationMenuDemo } from '@/components/Navbar';
import { ShootingStarsAndStarsBackgroundDemo } from '@/components/ui/ShootingStarsAndStarsBackgroundDemo';

interface LayoutChromeProps {
  children: React.ReactNode;
}

export function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/admin-dashboard' || pathname === '/orders';

  return (
    <>
      {!hideNavbar && <NavigationMenuDemo />}
      <ShootingStarsAndStarsBackgroundDemo />
      <div className="relative z-10">{children}</div>
    </>
  );
}
