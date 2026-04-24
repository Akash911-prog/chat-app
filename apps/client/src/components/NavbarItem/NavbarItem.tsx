import React, { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const NavbarItem = ({ children, className = "", style = {} }: CardProps) => {
    return <div>{children}</div>;
};

export default NavbarItem;
