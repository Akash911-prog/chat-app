import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserFormSchema } from "@repo/shared/common";
import type { loginUserForm } from "@repo/shared";
import { useState } from "react";
import { customToast } from "../../libs/toastHelper";
import { useLoginAction } from "../../hooks/useLoginAction";

// UI Components
import Button from "../ui/Buttons";
import { FloatingInput } from "../ui/FloatingInput";

const LoginForm = ({ onSwitch = () => {} }) => {
    const [closed, setClosed] = useState(true);
    const { handleLogin, isSubmitting } = useLoginAction();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<loginUserForm>({
        resolver: zodResolver(loginUserFormSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: loginUserForm) => {
        await customToast.promise(handleLogin(data), {
            success: "Logged in successfully",
            loading: "Logging you in...",
            error: "Either the username or password is wrong",
        });
    };

    return (
        <>
            <div className="flex items-center gap-2 mb-7">
                <div className="w-8 h-8 rounded-[9px] bg-accent flex items-center justify-center" />
                <span className="font-mono text-[15px] font-medium">
                    cipher
                </span>
            </div>

            <p className="text-xl font-medium mb-1">Login</p>
            <p className="font-mono text-[11px] text-text-muted mb-7 tracking-wide">
                // end-to-end encrypted
            </p>

            <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FloatingInput
                    id="username"
                    label="username"
                    type="text"
                    error={errors.username?.message}
                    {...register("username")}
                />

                <FloatingInput
                    id="password"
                    label="password"
                    type="password"
                    closed={closed}
                    onClick={() => setClosed(!closed)}
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className="h-px bg-border my-1" />

                <Button
                    type="submit"
                    className="w-full py-2"
                    disabled={isSubmitting || !isValid}
                >
                    {isSubmitting ? "logging in..." : "login"}
                </Button>

                <p className="text-center font-mono text-[11px] text-text-secondary">
                    don't have an account?{" "}
                    <span
                        onClick={onSwitch}
                        className="text-accent hover:opacity-80 cursor-pointer"
                    >
                        register
                    </span>
                </p>
            </form>
        </>
    );
};

export default LoginForm;
