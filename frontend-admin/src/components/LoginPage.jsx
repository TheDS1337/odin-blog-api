import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event)
    {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            if( !response.ok )
                throw new Error("Invalid username or password.");

            navigate("/");
        } catch( err ) {
            setError(err.message || "Unable to log in.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">WELCOME BACK</p>
                <h1>Good to see you.</h1>
                <p className="auth-description">
                    Sign in to continue to your journal.
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            autoComplete="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Signing in..." : "Log in"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </section>
        </main>
    );
};