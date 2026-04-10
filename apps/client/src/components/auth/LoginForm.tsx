import Button from "../ui/Buttons";
import { FloatingInput } from "../ui/FloatingInput";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Errors, loginUserFormSchema } from "@repo/shared/common";
import type { loginUserForm } from "@repo/shared";
import { useState } from "react";
import { useKeyStore } from "../../store/accessKey";
import { clientEnv } from "@repo/shared/env/client";
import { customToast } from "../../libs/toastHelper";
import { unwrapPrivateKey } from "../../libs/keyGeneration";
import { getPrivateKey, storePrivateKey } from "../../libs/indexDbHelpers";

const LoginForm = ({ onSwitch = () => {} }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginUserFormSchema),
    });

    const keyStore = useKeyStore();

    const [closed, setClosed] = useState(true);

    const login = async (data: { username: string; password: string }) => {
        const res = await fetch(`${clientEnv.VITE_SERVER_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Critical for JSON bodies
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw Errors.INVALID_CREDENTIALS;

        const { accessKey, cipher, iv, salt, id } = await res.json();

        keyStore.setAccessKey(accessKey);

        const privateKey = await unwrapPrivateKey(
            cipher,
            data.password,
            salt,
            iv,
        );

        const existing = await getPrivateKey(id);
        if (!existing) {
            await storePrivateKey(id, privateKey);
        }
    };

    const onSubmit: SubmitHandler<loginUserForm> = async (data) => {
        customToast.promise(login(data), {
            success: "logged in successfully",
            loading: "logging you in...",
            error: "either the username or password is wrong",
        });
    };

    const password = useWatch({
        control: control,
        name: "password",
        defaultValue: "",
    });

    const username = useWatch({
        control: control,
        name: "username",
        defaultValue: "",
    });

    const isDisabled = !password || !username;

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
                    {...register("username", { required: true })}
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
                    disabled={isDisabled}
                >
                    login
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
