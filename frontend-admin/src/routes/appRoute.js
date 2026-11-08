import AppPage from "../pages/AppPage.jsx"
import homeRoute from "./homeRoute.js";
import loginRoute from "./loginRoute.js";
import logoutRoute from "./logoutRoute.js";
import postsRoute from "./postsRoute.js";

export default {
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
    Component: AppPage,
    children: [
        homeRoute,
        loginRoute,
        logoutRoute,
        postsRoute
    ]
};