import React from "react";

const UserListItem = ({ username }: { username: string }) => {
    return (
        <div className="flex items-center min-h-18 px-4 py-3 gap-3 hover:bg-surface-raised">
            <div className="pfp">
                <div className="size-2xl flex items-center justify-center shrink-0 rounded-full bg-accent-muted text-accent-hover font-semibold text-lg">
                    {username[0].toUpperCase()}
                </div>
            </div>
            <div className="username font-medium tracking-wider text-lg">
                {username}
            </div>
        </div>
    );
};

export default UserListItem;
