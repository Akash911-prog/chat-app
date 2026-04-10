import * as React from "react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import App from "../App";
import { ToastStack } from "../components/ui/ToastStack";
import type { RouterContext } from "@repo/shared";

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return (
            <React.Fragment>
                <App />
                <ToastStack />
            </React.Fragment>
        );
    },
});
