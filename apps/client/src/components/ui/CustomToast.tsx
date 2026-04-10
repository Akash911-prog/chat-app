import toast, { type Toast } from "react-hot-toast";
import { motion } from "motion/react";

type ToastVariant = "success" | "error" | "info" | "warning" | "loading";

const config: Record<ToastVariant, { line: string; prefix: string }> = {
    success: { line: "hsl(142 69% 45%)", prefix: "//" },
    error: { line: "hsl(0 84% 60%)", prefix: "//" },
    info: { line: "hsl(192 91% 36%)", prefix: "//" },
    warning: { line: "hsl(38 92% 50%)", prefix: "//" },
    loading: { line: "hsl(240 5% 40%)", prefix: "//" },
};

function LoadingDots() {
    return (
        <span className="flex gap-[3px] items-center">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-[3px] h-[3px] rounded-full bg-text-muted inline-block"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </span>
    );
}

function SuccessIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <motion.circle
                cx="7"
                cy="7"
                r="6"
                stroke="hsl(142 69% 45%)"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
            />
            <motion.path
                d="M4.5 7l2 2 3-3"
                stroke="hsl(142 69% 45%)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <motion.circle
                cx="7"
                cy="7"
                r="6"
                stroke="hsl(0 84% 60%)"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
            />
            <motion.path
                d="M5 5l4 4M9 5l-4 4"
                stroke="hsl(0 84% 60%)"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            />
        </svg>
    );
}

export function CustomToastInner({ t, isTop }: { t: Toast; isTop: boolean }) {
    const variant: ToastVariant =
        t.type === "success"
            ? "success"
            : t.type === "error"
              ? "error"
              : t.type === "loading"
                ? "loading"
                : "info";

    const c = config[variant];
    const { title, message } = t.message as any;

    return (
        <div className="flex items-center gap-2.5 bg-surface border border-border rounded-[10px] px-3.5 py-2.5 w-full relative overflow-hidden">
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5"
                style={{ background: c.line }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
            />
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                {variant === "success" && <SuccessIcon />}
                {variant === "error" && <ErrorIcon />}
                {variant === "loading" && <LoadingDots />}
                {(variant === "info" || variant === "warning") && (
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: c.line }}
                    />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-mono text-[12px] font-medium text-text-primary">
                    {title}
                </p>
                <p className="font-mono text-[11px] text-text-muted truncate">
                    {c.prefix} {message}
                </p>
            </div>
            {isTop && variant !== "loading" && (
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="font-mono text-[11px] text-text-muted hover:text-text-primary transition-colors shrink-0"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
