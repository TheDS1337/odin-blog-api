import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function App()
{
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("blog-theme") === "light" ? "light" : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem("blog-theme", theme);
        } catch {
        // The theme still works if browser storage is unavailable.
        }
    }, [theme]);

    return (
        <div className="app-shell">
            <Header
                theme={theme}
                onToggleTheme={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            />

            <Outlet />

            <Footer />
        </div>
    );
};