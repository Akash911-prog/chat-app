import React from "react";
import Back from "../../icons/Back";
import { useNavigate } from "@tanstack/react-router";
import ThreeDots from "../../icons/ThreeDots";

type props = {
    username: string;
};

const ChatTopBar = ({ username = "akash" }: props) => {
    const navigate = useNavigate();

    return (
        <div className="w-full grid-cols-4 grid px-2 py-3 bg-bg">
            <div className="flex col-span-3 gap-5">
                <div
                    className="back self-center"
                    onClick={() => navigate({ to: "/" })}
                >
                    <Back />
                </div>
                <div className="flex gap-3">
                    <div className="pfp flex items-center justify-center size-xl shrink-0 rounded-full bg-accent-muted text-accent-hover font-semibold text-lg">
                        {username[0].toUpperCase()}
                    </div>
                    <div className="name self-center font-medium text-lg">
                        {username}
                    </div>
                </div>
            </div>
            <div className="menu mx-auto my-auto flex">
                {/* TODO: Add popup menu and onclick handler */}
                <ThreeDots className="self-center" />
            </div>
        </div>
    );
};

export default ChatTopBar;
