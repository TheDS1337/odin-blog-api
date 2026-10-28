import { redirect } from "react-router";
import App from './App.jsx'
import HomePage from './components/HomePage.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';

export default [
    {
        id: "root",
        loader: async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include"
                });

                if( !response.ok )
                    throw new Error("User is not logged-in.");

                return response.json();
            } catch( err ) {
                return { error: err.message || "User is not logged-in." };
            }
        },
        Component: App,
        children: [
            {
                index: true,
                loader: async () => {
                    const response = await fetch("/api/posts", {
                        method: "GET",
                        credentials: "include"
                    });

                    if( !response.ok )
                        throw new Error("Failed to load posts.");
                    
                    return response.json();
                },
                Component: HomePage 
            },
            {
                path: "signup",
                action: async ({ request }) => {
                    const data = await request.formData();
                    const { firstName, lastName, username, password, confirmPassword } = Object.fromEntries(data.entries());

                    try {
                        const response = await fetch("/api/auth/signup", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ firstName, lastName, username, password, confirmPassword })
                        });

                        if( !response.ok ) {
                            const err = (await response.json()).error;
                            throw new Error(Array.isArray(err) ? err[0].msg : err);
                        }

                        return redirect("/");
                    } catch( err ) {
                        return { error: err.message || "Unable to sign-up." };
                    }
                },
                Component: SignupPage
            },
            {
                path: "login",
                action: async ({ request }) => {
                    const data = await request.formData();
                    const { username, password } = Object.fromEntries(data.entries());

                    try {
                        const response = await fetch("/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ username, password })
                        });

                        if( !response.ok )
                            throw new Error("Unable to log-in.");

                        return redirect("/");
                    } catch( err ) {
                        return { error: err.message || "Unable to log-in." };
                    }
                },
                Component: LoginPage
            },
            {
                path: "logout",
                loader: async () => redirect("/"),
                action: async () => {
                    try {
                        await fetch("/api/auth/logout", {
                            method: "POST",
                            credentials: "include"
                        });

                        return redirect("/login");
                    } catch( err ) {
                        return { error: err.message || "Something weird happened while logging out." };
                    }
                }
            }
        ]
    }
];