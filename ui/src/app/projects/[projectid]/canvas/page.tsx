"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically load the CanvasBoard component with SSR disabled
// This prevents 'window is not defined' errors during build/SSR because Konva needs the DOM.
const CanvasBoard = dynamic(
  () => import('./components/CanvasBoard'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading canvas board...</p>
      </div>
    ) 
  }
);

export default function CanvasPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Canvas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Brainstorm and draw freely on an infinite canvas workspace.
        </p>
      </div>
      <div className="grow relative">
        <CanvasBoard />
      </div>
    </div>
  );
}
