import { twMerge } from "tailwind-merge";

const Search = ({
    size,
    strokeWidth,
    className,
}: {
    size: number;
    strokeWidth: number;
    className?: string;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={twMerge("cursor-pointer", className)}
        >
            <circle cx="10" cy="7" r="4" />
            <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
            <circle cx="17" cy="17" r="3" />
            <path d="m21 21-1.9-1.9" />
        </svg>
    );
};

export default Search;
