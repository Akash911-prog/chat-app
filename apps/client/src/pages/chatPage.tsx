import React, { useState } from "react";
import ChatInputBox from "../components/chatInputBox/ChatInputBox";
import ChatTopBar from "../components/ChatTopBar/ChatTopBar";
import "./chatPage.css";
import { useRoomStore } from "../store/room";

const ChatPage = ({ chatId = "" }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const room = useRoomStore().getRoom(chatId);

    return (
        <div className="flex flex-col h-screen">
            <div className="pattern-bg absolute w-screen h-screen -z-30"></div>
            <div className="top-bar">
                <ChatTopBar username={room ? room.username : "unknown"} />
            </div>
            <div className="message-area flex-1 overflow-scroll">
                {messages.map((message, index) => {
                    return (
                        <div className="bg-bubble-out" key={index}>
                            {message}
                        </div>
                    );
                })}
            </div>
            <div className="restricted bg-transparent relative bottom-0 h-[7%]"></div>
            <div>
                <ChatInputBox
                    className="w-[96%] absolute bottom-2 left-2"
                    setValue={setMessages}
                />
            </div>
        </div>
    );
};

export default ChatPage;
