import { LensDemo } from "@/components/LensCard";
import diamondsData from "@/data/diamonds.json";
import React from "react";

export default function Home() {
  return (
    <div className="relative z-20">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {diamondsData.diamonds.map((diamond) => (
          <LensDemo
            key={diamond.id}
            {...diamond}
          />
        ))}
      </main>
    </div>
  );
}
