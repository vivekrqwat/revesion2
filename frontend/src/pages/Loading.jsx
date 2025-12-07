import React from 'react';

export default function Loading({msg}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--color-text)] transition-colors duration-300">
      <div className="flex flex-col items-center space-y-6 border-2 border-dashed border-[var(--border)] px-12 py-10 rounded-2xl">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        
        {/* Loading Image */}
        <img 
          src="/monk.webp" 
          alt="Loading..." 
          className="w-20 h-20 object-contain" 
        />
        
        {/* Loading Text */}
        <div className="text-2xl font-bold tracking-wide animate-pulse text-[var(--color-text)]">
          {msg || 'LOADING YOUR NOTE_HUB...'}
        </div>
      </div>
    </div>
  );
}