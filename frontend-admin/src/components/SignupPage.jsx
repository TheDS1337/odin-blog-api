import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SignupPage()
{
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event)
    {
        event.preventDefault();
        setError("");

        if( password !== confirmPassword ) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    password
                })
            });

            if( !response.ok ) {
                let message = "Unable to create your account.";

                try {
                    const data = await response.json();

                    if( data.message )
                        message = data.message;
                } catch {
                    // Keep the default error message.
                }

                throw new Error(message);
            }

            // If your signup endpoint also logs the user in,
            // the browser will have the authentication cookie.
            navigate("/");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">JOIN THE JOURNAL</p>

                <h1>Create your account.</h1>

                <p className="auth-description">
                    Join the conversation and start sharing your ideas.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            minLength={3}
                            maxLength={32}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-first-name">First name</label>
                        <input
                            id="signup-first-name"
                            name="firstName"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-last-name">Last name</label>
                        <input
                            id="signup-last-name"
                            name="lastName"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-confirm-password">
                        Confirm password
                        </label>
                        <input
                            id="signup-confirm-password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
};