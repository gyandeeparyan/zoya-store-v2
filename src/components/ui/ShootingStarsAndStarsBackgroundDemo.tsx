"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";


export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className=" absolute inset-0 z-0  bg-neutral-900 flex flex-col items-center justify-center min-h-svh h-full  w-full">
    
     
     
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
