'use client';

import { usePathname } from 'next/navigation';
import { NavigationMenuDemo } from '@/components/Navbar';
import { ShootingStarsAndStarsBackgroundDemo } from '@/components/ui/ShootingStarsAndStarsBackgroundDemo';

export function AppChrome() {
  const pathname = usePathname();
  const isAdminDashboard = pathname?.startsWith('/admin-dashboard');

  if (isAdminDashboard) {
    return null;
  }

  return (
    <>
      <NavigationMenuDemo />
      <ShootingStarsAndStarsBackgroundDemo />
    </>
  );
}
