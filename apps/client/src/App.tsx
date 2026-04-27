import { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import { useThemeStore } from "./store/theme";

const queryClient = new QueryClient();

function App() {
    const theme = useThemeStore((s) => s.theme);
    console.log(theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <Outlet />
            </QueryClientProvider>
        </div>
    );
}

export default App;
