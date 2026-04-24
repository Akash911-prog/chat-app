import { createFileRoute } from "@tanstack/react-router";
import ChatList from "../../pages/chatList";
import { fetchChats } from "../../libs/fetchChats";

export const Route = createFileRoute("/_app/")({
    loader: fetchChats,
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <ChatList />
        </div>
    );
}
