import React from "react";

const UserListItem = ({ username }: { username: string }) => {
    return (
        <div>
            <div className="pfp">
                <div className="size-2xl">{username[0]}</div>
            </div>
            <div className="username">{username}</div>
        </div>
    );
};

export default UserListItem;
