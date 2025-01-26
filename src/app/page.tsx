import { LensDemo } from "@/components/LensCard";
import React from "react";

export default function Home() {
  return (
    <div className="relative z-20">
      <main className="grid-cols-1 md:grid-cols-3 grid gap-4">
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
        <LensDemo />
      </main>
    </div>
  );
}
