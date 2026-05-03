import {
    createFileRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";
import Navbar, { HamburgerMenuItem } from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import HomeIcon from "../../icons/Home";
import AddIcon from "../../icons/Add";
import type { NavItem } from "../../clientTypes";

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
    const navItems: NavItem[] = [
        { id: "home", label: "Home", url: "/", icon: <HomeIcon /> },
        {
            id: "new",
            label: "New Chat",
            url: "/new",
            icon: <AddIcon />,
        },
        {
            type: "custom",
            id: "menu",
            render: () => <HamburgerMenuItem />,
        },
    ];

    const { pathname } = useLocation();
    const isChatRoute = pathname.startsWith("/chat");

    return (
        <div>
            <div className="sm:hidden min-h-screen min-w-screen h-screen">
                {!isChatRoute && (
                    <Navbar items={navItems} defaultSelected="home" />
                )}
                <Outlet />
            </div>

            <div className="hidden sm:flex min-h-screen min-w-screen gap-sm">
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
}
