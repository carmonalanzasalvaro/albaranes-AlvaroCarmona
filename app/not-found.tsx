"use client";

import React from 'react';
import DinoGameChrome from 'react-chrome-dino-ts';
import 'react-chrome-dino-ts/index.css';

export default function DinoGame() {
  return (
    <section className="flex flex-col gap-8 items-center">
      {/* Contenedor con min-height */}
      <div className="w-full max-w-md min-h-[200px] flex justify-center items-center">
        <DinoGameChrome />
      </div>
      <h1 className="font-bold text-4xl">Page Not Found</h1>
    </section>
  );
}
