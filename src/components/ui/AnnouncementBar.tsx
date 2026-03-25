"use client";

import { useState, useEffect } from "react";

// ═══════════════════════════════════════════
// ANNOUNCEMENT BAR — Rotating promotional messages
// Dark bar at top of page with auto-cycling text
// ═══════════════════════════════════════════

const MESSAGES = [
  "Free Delivery on All Prepaid Orders 🚚",
  "India's Premium Phone Case Brand ✨",
  "MagSafe & Carbon Fiber Cases Now Live 🔥",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-dark-card border-b border-dark-border py-2 relative z-50">
      <div className="flex items-center justify-center">
        {/* Left arrow */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              setCurrentIndex(
                (prev) => (prev - 1 + MESSAGES.length) % MESSAGES.length
              );
              setIsVisible(true);
            }, 300);
          }}
          className="text-text-secondary hover:text-accent px-3 text-sm"
          aria-label="Previous announcement"
        >
          ‹
        </button>

        {/* Message */}
        <p
          className={`text-xs sm:text-sm text-text-primary font-medium text-center transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          }`}
        >
          {MESSAGES[currentIndex]}
        </p>

        {/* Right arrow */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
              setIsVisible(true);
            }, 300);
          }}
          className="text-text-secondary hover:text-accent px-3 text-sm"
          aria-label="Next announcement"
        >
          ›
        </button>
      </div>
    </div>
  );
}
