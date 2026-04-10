import { Errors, registerUserFormSchema } from "@repo/shared/common";
import Button from "../ui/Buttons";
import { FloatingInput } from "../ui/FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import type { registerUserForm, registerUserReq } from "@repo/shared";
import { useState } from "react";
import { customToast } from "../../libs/toastHelper";
import { clientEnv } from "@repo/shared/env/client";
import {
    generateKeyPair,
    toBase64,
    toBase64Safe,
    wrapKey,
} from "../../libs/keyGeneration";
import { storePrivateKey } from "../../libs/indexDbHelpers";

const RegisterForm = ({ onSwitch = () => {} }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerUserFormSchema),
    });

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

    const confirmPassword = useWatch({
        control: control,
        name: "confirmPassword",
        defaultValue: "",
    });

    const isDisabled = !username || !password || password !== confirmPassword;

    const [closed, setClosed] = useState({
        password: true,
        confirmPassword: true,
    });

    const registerUser = async (data: registerUserReq) => {
        const res = await fetch(`${clientEnv.VITE_SERVER_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Critical for JSON bodies
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw Errors.INVALID_CREDENTIALS;
        return res.json();
    };

    const onSubmit: SubmitHandler<registerUserForm> = async (data) => {
        const { publicKey, privateKey } = await generateKeyPair();

        const { encryptedPrivateKey, salt, iv } = await wrapKey(
            privateKey,
            data.password,
        );

        const exportedPublicKey = toBase64Safe(
            new Uint8Array(
                await window.crypto.subtle.exportKey("raw", publicKey),
            ),
        );

        const reqData: registerUserReq = {
            username: data.username,
            password: data.password,
            publicKey: exportedPublicKey,
            cipherText: encryptedPrivateKey,
            iv: iv,
            salt: salt,
        };

        const result = await customToast.promise(registerUser(reqData), {
            success: "successfully Registered",
            loading: "signing you up...",
            error: "Failed. please try again later",
        });

        const nonExtractableKey = await crypto.subtle.importKey(
            "pkcs8",
            await crypto.subtle.exportKey("pkcs8", privateKey), // export raw bytes
            { name: "ECDH", namedCurve: "P-256" },
            false, // extractable: false
            ["deriveKey", "deriveBits"],
        );

        await storePrivateKey(result.user.id, nonExtractableKey);
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
                        setClosed({
                            ...closed,
                            password: !closed.password,
                        })
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
                            setClosed({
                                ...closed,
                                confirmPassword: !closed.confirmPassword,
                            })
                        }
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    {password !== confirmPassword && (
                        <p className="text-danger font-mono text-sm">
                            {"confirm password and password doesnt match"}
                        </p>
                    )}
                </div>

                <div className="h-px bg-border my-1" />

                <Button
                    type="submit"
                    className="w-full py-2"
                    disabled={isDisabled}
                >
                    create account
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
