import { Link, useLocation } from "react-router";
import ThemeIcon from "./ThemeIcon.jsx";

export default function Header({ theme, onToggleTheme })
{
    const location = useLocation();
    const currentPath = location.pathname.slice(1);

    return (
        <header className="site-header">
            <Link
                className="brand"
                to="/"
                aria-label="The Journal home"
            >
                <span className="brand-mark">b.</span>
                <span>the journal</span>
            </Link>

            <nav
                className="nav-links"
                aria-label="Main navigation"
            >
                <Link to="/">Home</Link>

                { currentPath !== "login" && <Link to="/login">Log in</Link> }
                { currentPath !== "signup" && <Link className="nav-signup" to="/signup">Sign up</Link> }

                <button
                    className="theme-toggle"
                    type="button"
                    onClick={onToggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                    <ThemeIcon theme={theme} />
                </button>
            </nav>
        </header>
    );
};