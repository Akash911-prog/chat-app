import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { BubbleNavItem, NavItem } from "../../clientTypes";
import MenuIcon from "../../icons/Profile";

interface NavbarProps {
    items: NavItem[];
    defaultSelected?: string;
    onSelect?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Built-in hamburger menu item — swap `menuContent` for your real menu
// ---------------------------------------------------------------------------

//TODO: remove this and add the actual menu and modularize it
interface HamburgerMenuItemProps {
    menuContent?: React.ReactNode;
}

export function HamburgerMenuItem({ menuContent }: HamburgerMenuItemProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-40"
                        style={{ background: "rgba(0,0,0,0.45)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sheet */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-5 pb-10"
                        style={{
                            background: "rgba(20, 20, 30, 0.98)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 32,
                        }}
                    >
                        {/* Drag handle */}
                        <div
                            className="mx-auto mb-5 h-1 w-10 rounded-full"
                            style={{ background: "rgba(255,255,255,0.18)" }}
                        />

                        {menuContent ?? (
                            <PlaceholderMenuContent
                                onClose={() => setOpen(false)}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The button itself — rendered inside the navbar */}
            <MenuIcon isOpen={open} onClick={() => setOpen(!open)} />
        </>
    );
}

// Placeholder — replace with your real menu content
function PlaceholderMenuContent({ onClose }: { onClose: () => void }) {
    const items = ["Item one", "Item two", "Item three", "Item four"];
    return (
        <div className="flex flex-col gap-2">
            {items.map((label) => (
                <button
                    key={label}
                    onClick={onClose}
                    className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors focus:outline-none"
                    style={{
                        color: "rgba(255,255,255,0.8)",
                        background: "rgba(255,255,255,0.05)",
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

const NAVBAR_HEIGHT = 64;
const BUBBLE_SIZE = 54;
const BUBBLE_OVERLAP = 16; // px the bubble pokes above the navbar top edge

export default function Navbar({
    items,
    defaultSelected,
    onSelect,
}: NavbarProps) {
    const bubbleItems = items.filter(
        (i): i is BubbleNavItem => i.type !== "custom",
    );
    const [selected, setSelected] = useState(
        defaultSelected ?? bubbleItems[0]?.id,
    );
    // bubbleX is the center of the active button relative to the navbar's left edge
    const [bubbleX, setBubbleX] = useState<number | null>(null);
    const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = itemRefs.current[selected];
        const nav = navRef.current;
        if (!el || !nav) return;
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setBubbleX(elRect.left - navRect.left + elRect.width / 2);
    }, [selected]);

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    return (
        <div
            className="absolute left-[2.5%] bottom-1 flex flex-col items-stretch w-[95%]"
            // Total height = overlap region + navbar
            style={{ paddingTop: BUBBLE_OVERLAP }}
        >
            {/* Navbar bar */}
            <div
                ref={navRef}
                className="relative flex items-center gap-1 px-3 justify-around"
                style={{
                    background: "rgba(20, 20, 28, 0.98)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 22,
                    height: NAVBAR_HEIGHT,
                    zIndex: 20,
                }}
            >
                {items.map((item) => {
                    if (item.type === "custom") {
                        return (
                            <div key={item.id}>
                                {item.render({ onClose: () => {} })}
                            </div>
                        );
                    }

                    const isActive = item.id === selected;

                    return (
                        <div>
                            {bubbleX !== null && (
                                <motion.div
                                    className="absolute pointer-events-none"
                                    style={{
                                        top: -(BUBBLE_OVERLAP + 1),
                                        left: 0,
                                        zIndex: -10,
                                        width: BUBBLE_SIZE,
                                        height: BUBBLE_SIZE,
                                    }}
                                    animate={{ x: bubbleX - BUBBLE_SIZE / 2 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 28,
                                        mass: 0.8,
                                    }}
                                >
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{
                                            background: "hsl(5 60% 62%)",
                                            border: "2px solid rgba(255,255,255,0.11)",
                                            boxShadow:
                                                "0 -4px 20px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
                                        }}
                                    />
                                </motion.div>
                            )}
                            <button
                                key={item.id}
                                ref={(el) => {
                                    itemRefs.current[item.id] = el;
                                }}
                                onClick={() => handleSelect(item.id)}
                                className={`relative flex flex-col items-center justify-center rounded-xl focus:outline-none`}
                                style={{ width: 68, height: 56 }}
                                aria-label={item.label}
                            >
                                {/* Icon lifts up into the bubble */}
                                <motion.span
                                    animate={{
                                        y: isActive ? -(BUBBLE_OVERLAP + 6) : 0,
                                        scale: isActive ? 1.1 : 1,
                                        color: isActive
                                            ? "#ffffff"
                                            : "rgba(255,255,255,0.38)",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 28,
                                        mass: 0.8,
                                    }}
                                    className="flex items-center justify-center"
                                    style={{ position: "relative", zIndex: 31 }}
                                >
                                    {item.icon}
                                </motion.span>

                                {/* Label — only when inactive */}
                                <AnimatePresence>
                                    {!isActive && (
                                        <motion.span
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-1"
                                            style={{
                                                color: "rgba(255,255,255,0.35)",
                                                fontSize: 10,
                                                letterSpacing: "0.01em",
                                            }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
