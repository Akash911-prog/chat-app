import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import RegisterForm from "../../components/auth/RegisterForm";
import LoginForm from "../../components/auth/LoginForm";

export const Route = createFileRoute("/_auth/login")({
    component: AuthCard,
});

function AuthCard() {
    const [face, setFace] = useState<"login" | "register">("login");
    const flipped = face === "register";

    return (
        <div
            className="h-screen w-screen flex justify-center items-center bg-[radial-gradient(ellipse_at_center,hsl(240_8%_8%)_0%,hsl(240_10%_4%)_70%)]"
            style={{ perspective: "1200px" }}
        >
            <motion.div
                animate={{ y: flipped ? -40 : 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
                className="relative w-[clamp(50%,500px,90%)]"
                style={{ transformStyle: "preserve-3d", minHeight: "550px" }}
            >
                {/* front — login */}
                <motion.div
                    initial={false}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{
                        type: "spring" as const,
                        stiffness: 80,
                        damping: 14,
                    }}
                    style={{ backfaceVisibility: "hidden" }}
                    className="bg-surface border border-border rounded-2xl p-8"
                >
                    <LoginForm onSwitch={() => setFace("register")} />
                </motion.div>

                {/* back — register */}
                <motion.div
                    initial={false}
                    animate={{ rotateY: flipped ? 0 : -180 }}
                    transition={{
                        type: "spring" as const,
                        stiffness: 80,
                        damping: 14,
                    }}
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0 bg-surface border border-border rounded-2xl p-8"
                >
                    <RegisterForm onSwitch={() => setFace("login")} />
                </motion.div>
            </motion.div>
        </div>
    );
}
