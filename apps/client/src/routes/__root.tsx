import * as React from "react";
import { createRootRoute } from "@tanstack/react-router";
import App from "../App";
import { ToastStack } from "../components/ui/ToastStack";

export const Route = createRootRoute({
    component: () => {
        return (
            <React.Fragment>
                <App />
                <ToastStack />
            </React.Fragment>
        );
    },
});
