import { motion } from "motion/react";
import { useToaster } from "react-hot-toast";
import { CustomToastInner } from "./CustomToast";

export function ToastStack() {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause } = handlers;

    const visibleToasts = toasts.filter((t) => t.visible).slice(0, 4);

    return (
        <div
            className="fixed top-6 right-6 flex flex-col items-end"
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            <div
                className="relative"
                style={{ height: "60px", width: "280px" }}
            >
                {visibleToasts.map((t, i) => {
                    const isTop = i === visibleToasts.length - 1;
                    const reverseIndex = visibleToasts.length - 1 - i;
                    const scale = 1 - reverseIndex * 0.04;
                    const y = reverseIndex * -6;
                    const opacity =
                        reverseIndex === 0 ? 1 : reverseIndex === 1 ? 0.7 : 0.4;

                    return (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{
                                opacity,
                                y,
                                scale,
                                zIndex: i,
                            }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{
                                type: "spring" as const,
                                stiffness: 200,
                                damping: 20,
                            }}
                            className="absolute bottom-0 right-0"
                            style={{ width: "280px" }}
                        >
                            <CustomToastInner t={t} isTop={isTop} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
