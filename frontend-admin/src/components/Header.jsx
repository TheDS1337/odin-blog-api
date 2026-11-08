import { Link, Form, useLocation, useRouteLoaderData } from "react-router";
import ThemeIcon from "./ThemeIcon.jsx";

export default function Header({ theme, onToggleTheme })
{
    const location = useLocation();
    const currentPath = location.pathname.slice(1);

    const user = useRouteLoaderData("root");
    const isLoggedIn = user && !('error' in user);

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
                {
                    isLoggedIn ? (
                        <>
                            <span>Welcome, {user.firstName} {user.lastName}</span>

                            <Link to="/">Home</Link>

                            { user.isAdmin && <Link to="/posts/new" className="nav-create-post">+ New post</Link> }

                            <Form action="/logout" method="post">
                                <button
                                    className="logout-button"
                                    type="submit"
                                >
                                    Log out
                                </button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Link to="/">Home</Link>
                            
                            { currentPath !== "login" && <Link to="/login">Log in</Link> }
                            { currentPath !== "signup" && <Link className="nav-signup" to="/signup">Sign up</Link> }
                        </>
                    )
                }

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