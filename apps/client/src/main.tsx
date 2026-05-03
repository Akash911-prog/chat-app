import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";

import { routeTree } from "./routeTree.gen.ts";
import { isAuthenticated } from "./libs/auth.ts";

const routerContext = {
    user: null,
    auth: {
        isAuthenticated: isAuthenticated,
    },
};

export const router = createRouter({ routeTree, context: routerContext });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
