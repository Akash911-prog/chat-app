import { createFileRoute } from "@tanstack/react-router";
import NewChat from "../../pages/newChat";

export const Route = createFileRoute("/_app/new")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <NewChat />
        </div>
    );
}
