import { useState } from "react";
// import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import Button from "../ui/Buttons";

const Navbar = () => {
    // const [menuOpen, setmenuOpen] = useState(false);
    return (
        <>
            <nav className="sm:hidden absolute bottom-0 border bg-background w-full h-[8%]">
                <div className="chat"></div>
                <div className="new"></div>
                <div className="profile"></div>
            </nav>
        </>
    );
};

export default Navbar;
