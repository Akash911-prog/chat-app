import { type FC } from "react";

const sizeMap = {
    sm: "h-6",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
};

interface MenuIconProps {
    isOpen: boolean;
    onClick?: () => void;
    size?: keyof typeof sizeMap;
    className?: string;
    strokeColor?: string;
}

const MenuIcon: FC<MenuIconProps> = ({
    isOpen,
    onClick,
    size = "md",
    className = "",
    strokeColor = "white",
}) => {
    return (
        <div className={className}>
            <style>{`
        .hamburger svg {
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hamburger-line {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
          transition:
            stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
            stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hamburger-line-top-bottom {
          stroke-dasharray: 12 63;
        }
        .hamburger-open {
          transform: rotate(-45deg);
        }
        .hamburger-open .hamburger-line-top-bottom {
          stroke-dasharray: 20 300;
          stroke-dashoffset: -32.42;
        }
      `}</style>

            <button
                className="hamburger cursor-pointer bg-transparent border-none p-0"
                onClick={onClick}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                <svg
                    viewBox="0 0 32 32"
                    className={`${sizeMap[size]} ${isOpen ? "hamburger-open" : ""}`}
                >
                    <path
                        className="hamburger-line hamburger-line-top-bottom"
                        style={{ stroke: strokeColor }}
                        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    />
                    <path
                        className="hamburger-line"
                        style={{ stroke: strokeColor }}
                        d="M7 16 27 16"
                    />
                </svg>
            </button>
        </div>
    );
};

export default MenuIcon;
