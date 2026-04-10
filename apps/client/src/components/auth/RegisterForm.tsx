import { registerUserFormSchema } from "@repo/shared/common";
import Button from "../ui/Buttons";
import { FloatingInput } from "../ui/FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { registerUserForm } from "@repo/shared";
import { useState } from "react";
import { customToast } from "../../libs/toastHelper";
import { useRegisterAction } from "../../hooks/useRegisterAction";

const RegisterForm = ({ onSwitch = () => {} }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm<registerUserForm>({
        resolver: zodResolver(registerUserFormSchema),
        mode: "onChange",
    });

    const { handleRegister, isSubmitting } = useRegisterAction();
    const [closed, setClosed] = useState({
        password: true,
        confirmPassword: true,
    });

    // Watch values for immediate UI feedback
    const password = useWatch({ control, name: "password", defaultValue: "" });
    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
        defaultValue: "",
    });
    const passwordsMatch = password === confirmPassword;

    const onSubmit = async (data: registerUserForm) => {
        await customToast.promise(handleRegister(data), {
            success: "Successfully Registered",
            loading: "Signing you up...",
            error: "Registration failed. Please try again.",
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

            <p className="text-xl font-medium mb-1">create account</p>
            <p className="font-mono text-[11px] text-text-muted mb-7 tracking-wide">
                // end-to-end encrypted
            </p>

            <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FloatingInput
                    id="create-username"
                    label="username"
                    type="text"
                    error={errors.username?.message}
                    {...register("username")}
                />

                <FloatingInput
                    id="create-password"
                    label="password"
                    type="password"
                    closed={closed.password}
                    onClick={() =>
                        setClosed((prev) => ({
                            ...prev,
                            password: !prev.password,
                        }))
                    }
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className="flex flex-col gap-2">
                    <FloatingInput
                        id="confirm-password"
                        label="confirm password"
                        type="password"
                        closed={closed.confirmPassword}
                        onClick={() =>
                            setClosed((prev) => ({
                                ...prev,
                                confirmPassword: !prev.confirmPassword,
                            }))
                        }
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />
                    {!passwordsMatch && confirmPassword.length > 0 && (
                        <p className="text-danger font-mono text-sm">
                            passwords do not match
                        </p>
                    )}
                </div>

                <div className="h-px bg-border my-1" />

                <Button
                    type="submit"
                    className="w-full py-2"
                    disabled={isSubmitting || !isValid || !passwordsMatch}
                >
                    {isSubmitting ? "creating..." : "create account"}
                </Button>

                <p className="text-center font-mono text-[clamp(11px,13px,16px)] text-text-secondary">
                    already have an account?{" "}
                    <span
                        onClick={onSwitch}
                        className="text-accent hover:opacity-80 cursor-pointer"
                    >
                        log in
                    </span>
                </p>
            </form>
        </>
    );
};

export default RegisterForm;
