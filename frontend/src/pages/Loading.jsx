import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-6 border-2 border-dashed border-border px-12 py-10 rounded-2xl">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <img 
          src="/monk.png" 
          alt="Loading..." 
          className="w-20 h-20 object-contain" 
        />
        <div className="text-2xl font-bold tracking-wide animate-pulse">
          LOADING YOUR NOTE_HUB...
        </div>
      </div>
    </div>
  );
}
