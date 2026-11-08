import { redirect } from "react-router";
import NewPostPage from "../pages/NewPostPage.jsx";

export default {
    path: "new",
    action: async ({ request }) => {
        const data = await request.formData();
        const { title, content } = Object.fromEntries(data.entries());

        try {
            const response = await fetch(`/api/posts/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title, content })
            });

            if( !response.ok )
                throw new Error("Unable to create a new post.");

            const { id } = (await response.json()).post;

            return redirect(`/posts/${id}`);
        } catch( err ) {
            return { error: err.message || "Unable to create a new post." };
        }
    },
    Component: NewPostPage
};