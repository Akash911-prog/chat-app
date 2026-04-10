import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

export const Route = createFileRoute("/_app")({
    beforeLoad: async ({ context, location }) => {
        if (!(await context.auth.isAuthenticated())) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <div className="sm:hidden min-h-screen min-w-screen">
                <Navbar />
                <Outlet />
            </div>

            <div className="hidden sm:flex min-h-screen min-w-screen gap-sm">
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
}
