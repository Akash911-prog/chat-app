import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

type EyeProps = {
    closed?: boolean;
    className?: string;
};

const Eye = ({ closed = false, className }: EyeProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={twMerge("cursor-pointer", className)}
        >
            {/* always visible — eye paths */}
            <motion.path
                d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                animate={{ opacity: closed ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
            />
            <motion.circle
                cx="12"
                cy="12"
                r="3"
                animate={{ opacity: closed ? 0.5 : 1 }}
                transition={{ duration: 0.2 }}
            />

            {/* slash line — draws in and out */}
            <motion.line
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: closed ? 1 : 0,
                    opacity: closed ? 0.7 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />
        </svg>
    );
};

export default Eye;
