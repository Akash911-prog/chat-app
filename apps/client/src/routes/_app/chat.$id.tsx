import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "../../pages/chatPage";

export const Route = createFileRoute("/_app/chat/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { id: chatId } = Route.useParams();
    return (
        <div>
            <ChatPage chatId={chatId} />
        </div>
    );
}
