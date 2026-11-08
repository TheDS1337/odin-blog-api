import { useState } from "react";
import { Link, Form, Navigate, useRouteLoaderData, useActionData, useNavigation } from "react-router";

export default function SignupPage()
{
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const error = useActionData()?.error;
    
    const user = useRouteLoaderData("root");
    const isUserLoggedIn = user && !('error' in user);

    if( isUserLoggedIn )
        return <Navigate to="/" replace />;

    return (
        <main className="auth-page">
            <section className="auth-card">
                <p className="eyebrow">JOIN THE JOURNAL</p>

                <h1>Create your account.</h1>

                <p className="auth-description">
                    Join the conversation and start sharing your ideas.
                </p>

                <Form
                    className="auth-form"
                    action="/signup"
                    method="post"
                    noValidate
                >
                    <div className="form-field">
                        <label htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            minLength={1}
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
                            minLength={1}
                            maxLength={32}
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
                            minLength={1}
                            maxLength={32}
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
                            minLength={4}
                            maxLength={32}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </Form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    );
};