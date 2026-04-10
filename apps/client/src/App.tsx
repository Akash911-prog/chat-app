import { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import "./App.css";
import { useThemeStore } from "./store/theme";

function App() {
    const theme = useThemeStore((s) => s.theme);
    console.log(theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default App;
