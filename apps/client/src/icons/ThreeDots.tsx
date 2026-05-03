import React from "react";
import { twMerge } from "tailwind-merge";

const ThreeDots = ({ className = "" }) => {
    return (
        <button
            className={twMerge(
                "rounded-full p-1 active:border-gray-700 active:border active:bg-surface-raised transition-all",
                className,
            )}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
            >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
            </svg>
        </button>
    );
};

export default ThreeDots;
