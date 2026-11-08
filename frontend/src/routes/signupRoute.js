import { redirect } from "react-router";
import SignupPage from "../pages/SignupPage.jsx";

export default {
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
};