import { redirect } from "react-router";

export default {
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
};