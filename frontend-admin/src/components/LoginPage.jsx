import { useState } from "react";
import { Link, Form, Navigate, useRouteLoaderData, useActionData, useNavigation } from "react-router";

export default function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const error = useActionData()?.error;
    const isLoggedIn = useRouteLoaderData("root")?.id;

    if( isLoggedIn )
        return <Navigate to="/" replace />;

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">WELCOME BACK</p>
                <h1>Good to see you.</h1>
                <p className="auth-description">
                    Sign in to continue to your journal.
                </p>

                <Form
                    className="auth-form"
                    action="/login"
                    method="post"
                >
                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
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
                            name="password"
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Log in"}
                    </button>
                </Form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </section>
        </main>
    );
};