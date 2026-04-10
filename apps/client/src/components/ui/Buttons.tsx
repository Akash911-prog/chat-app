import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger";
};

export default function Button({
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    const base =
        "rounded-md text-sm transition-colors cursor-pointer disabled:opacity-50";
    const variants = {
        primary: "bg-accent text-primary hover:bg-accent-hover",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-surface",
        danger: "bg-danger text-white hover:opacity-90",
    };
    return (
        <button
            className={twMerge(base, variants[variant], className)}
            {...props}
        />
    );
}
