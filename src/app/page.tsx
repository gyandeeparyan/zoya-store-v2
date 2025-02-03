import { LensDemo } from "@/components/LensCard";
import diamondsData from "@/data/diamonds.json";
import React from "react";

export default function Home() {
  return (
    <div className="relative z-20">
      <div className="text-center  py-8 md:pb-2 md:pt-14">
        <h1 className="text-2xl md:text-4xl font-thin text-white mb-2 tracking-[0.5em] uppercase">
          Mobile Legends Bang Bang
        </h1>
        <p className="text-violet-200 text-lg md:text-xl  tracking-[0.1] uppercase">
          Diamond Store
        </p>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
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
