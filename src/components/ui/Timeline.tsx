import React from "react";

export interface TimelineStep {
  label: string;
  description?: string;
  done: boolean;
  date?: string;
  isCurrent?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function Timeline({ steps, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background Track Line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
      
      <div className="space-y-6 relative">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          
          return (
            <div key={i} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors ${
                  step.done 
                    ? "bg-green-500 border-green-500 text-white shadow-sm shadow-green-500/20" 
                    : step.isCurrent 
                      ? "bg-accent border-accent text-white shadow-sm shadow-accent/20 animate-pulse"
                      : "bg-gray-100 border-gray-100 text-gray-400"
                }`}>
                  {step.done ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : step.isCurrent ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  )}
                </div>
              </div>
              
              <div className={`pt-1 ${!step.done && !step.isCurrent ? 'opacity-50' : ''} pb-2`}>
                <p className="text-sm font-bold text-text-primary">{step.label}</p>
                {step.description && (
                  <p className="text-[11px] text-text-muted mt-0.5">{step.description}</p>
                )}
                {step.date && (
                  <p className="text-[11px] text-text-muted mt-0.5">{step.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
