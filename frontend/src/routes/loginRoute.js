import { redirect } from "react-router";
import LoginPage from "../pages/LoginPage.jsx";

export default {
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
};