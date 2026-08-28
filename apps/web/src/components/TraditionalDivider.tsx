import React from "react";

interface TraditionalDividerProps {
  className?: string;
}

export function TraditionalDivider({ className = "" }: TraditionalDividerProps) {
  return (
    <div className={`flex w-full items-center justify-center py-8 opacity-50 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-4 flex gap-2">
        <div className="h-2 w-2 rotate-45 border border-gold" />
        <div className="h-2 w-2 rotate-45 bg-gold" />
        <div className="h-2 w-2 rotate-45 border border-gold" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-gold via-gold to-transparent" />
    </div>
  );
}
