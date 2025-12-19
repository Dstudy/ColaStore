"use client";

import { useState } from "react";

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  className,
}: ImageWithFallbackProps) {
  const [showFallback, setShowFallback] = useState(!src);

  if (showFallback) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 ${className || ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25a1.5 1.5 0 011.5-1.5h13.5a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V5.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 14.25l2.61-3.48a1 1 0 011.54-.07l1.82 1.96a1 1 0 001.52-.04l1.51-1.87a1 1 0 011.58.03l2.02 2.92"
          />
          <circle cx="8.25" cy="8.25" r="1.25" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wide">
          Product Image
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setShowFallback(true)}
    />
  );
}

