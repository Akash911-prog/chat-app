import React from "react";

interface ChatListItemProps {
    username: string;
    lastMessage?: string;
    timeStamp: string;
}

const ChatListItem = ({
    username = "Username",
    lastMessage = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit autem, eos sequi reiciendis temporibus commodi quisquam, expedita velit eligendi quidem quibusdam animi iste.",
    timeStamp = "5:43 pm",
}: ChatListItemProps) => {
    return (
        <div className="flex items-center min-h-18 px-4 py-3 gap-3">
            <div className="flex items-center justify-center h-11 w-11 shrink-0 rounded-full bg-accent-muted text-accent-hover font-semibold text-lg">
                {username[0].toUpperCase()}
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-text-primary truncate">
                        {username}
                    </div>
                    <div className="text-text-muted text-xs shrink-0">
                        {timeStamp}
                    </div>
                </div>
                <div className="text-sm text-text-muted truncate">
                    {lastMessage}
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
