"use client";

import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

type AboutCardProps = {
    image?: string;
    title: string;
    description: string;
    variant?: "default" | "gradient" | "glass" | "minimal";
    imagePosition?: "top" | "left" | "right";
    className?: string;
};

export default function AboutCard({
    image,
    title,
    description,
    variant = "default",
    imagePosition = "top",
    className = "",
}: AboutCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Variant styles
    const variantStyles = {
        default: "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg hover:shadow-2xl",
        gradient: "bg-gradient-to-br from-red-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-red-100 dark:border-neutral-700 shadow-xl hover:shadow-2xl",
        glass: "bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl",
        minimal: "bg-transparent border-none shadow-none hover:bg-gray-50 dark:hover:bg-neutral-900/50",
    };

    // Layout styles based on image position
    const layoutStyles = {
        top: "flex-col",
        left: "flex-row",
        right: "flex-row-reverse",
    };

    return (
        <div
            className={`
        group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
        ${variantStyles[variant]}
        ${layoutStyles[imagePosition]}
        ${isHovered ? "scale-[1.02]" : "scale-100"}
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div
                className={`
          relative overflow-hidden
          ${imagePosition === "top" ? "w-full h-64" : "w-1/2 h-full min-h-[300px]"}
        `}
            >
                {/* Gradient Overlay */}
                <div
                    className={`
            absolute inset-0 z-10 transition-opacity duration-500
            ${variant === "gradient" ? "bg-gradient-to-t from-red-900/30 to-transparent" : ""}
            ${isHovered ? "opacity-70" : "opacity-100"}
          `}
                />

                {/* Image */}
                <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110">
                    <ImageWithFallback
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Animated Corner Accent */}
                <div
                    className={`
            absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-transparent
            transform transition-all duration-500 ease-out
            ${isHovered ? "scale-150 opacity-100" : "scale-100 opacity-0"}
          `}
                />
            </div>

            {/* Content Container */}
            <div
                className={`
          flex flex-col justify-center p-8
          ${imagePosition === "top" ? "w-full" : "w-1/2"}
        `}
            >
                {/* Decorative Line */}
                <div
                    className={`
            w-16 h-1 mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-700
            transform transition-all duration-500 ease-out origin-left
            ${isHovered ? "scale-x-150" : "scale-x-100"}
          `}
                />

                {/* Title */}
                <h3
                    className={`
            text-3xl md:text-4xl font-bold mb-4 
            bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300
            bg-clip-text text-transparent
            transform transition-all duration-300
            ${isHovered ? "translate-x-2" : "translate-x-0"}
          `}
                >
                    {title}
                </h3>

                {/* Description */}
                <p
                    className={`
            text-base md:text-lg leading-relaxed
            text-gray-700 dark:text-gray-300
            transform transition-all duration-300 delay-75
            ${isHovered ? "translate-x-2" : "translate-x-0"}
          `}
                >
                    {description}
                </p>

                {/* Hover Indicator */}
                <div
                    className={`
            mt-6 flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold
            transform transition-all duration-300 delay-100
            ${isHovered ? "translate-x-2 opacity-100" : "translate-x-0 opacity-0"}
          `}
                >
                    <span>Learn More</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5 animate-pulse"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </div>
            </div>

            {/* Background Pattern (subtle) */}
            <div
                className={`
          absolute inset-0 opacity-5 pointer-events-none
          bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]
          transition-opacity duration-500
          ${isHovered ? "opacity-10" : "opacity-5"}
        `}
            />
        </div>
    );
}