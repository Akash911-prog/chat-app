import React, { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import type { safeUser } from "../clientTypes";
import UserListItem from "../components/UserListItem/UserListItem";
import { apiFetch } from "../libs/fetch";
import { clientEnv } from "@repo/shared/env/client";
import Search from "../icons/Search";
import { motion } from "motion/react";
import socket from "../libs/socket";
import { router } from "../main";

const NewChat = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 150);
    const user = router.options.context.user;

    const { data: users = [] } = useQuery<safeUser[]>({
        queryKey: ["users", "search", debouncedQuery],
        queryFn: async () => {
            const res = await apiFetch(
                `${clientEnv.VITE_SERVER_URL}/chat/users?query=${debouncedQuery}`,
            );
            const { users } = await res.json();
            return users;
        },
        enabled: debouncedQuery.trim().length > 0,
    });

    const onClick = (otherUserId: string, otherUsername: string) => {
        socket.emit("join_room", {
            userId: user?.id,
            username: user?.username,
            otherUserId: otherUserId,
            otherUsername: otherUsername,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="pt-5">
                <SearchBar setQuery={setQuery} />
            </div>
            <div
                className={`${users.length <= 0 ? "flex-1 flex items-center justify-center flex-col" : ""}`}
            >
                {users.length > 0 ? (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {users.map((user) => (
                            <UserListItem
                                key={user.id}
                                username={user.username}
                                onClick={() => onClick(user.id, user.username)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center gap-2 text-text-muted"
                    >
                        <Search size={44} strokeWidth={1.5} />
                        <p className="font-medium text-lg">
                            Find someone to chat with
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default NewChat;
