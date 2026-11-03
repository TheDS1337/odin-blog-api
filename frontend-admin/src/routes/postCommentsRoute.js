import { redirect } from "react-router";
import commentRoute from "./commentRoute.js";

export default {
    path: "comments",
    loader: async ({ params }) => redirect(`/posts/${params.postId}`),
    action: async ({ request, params }) => {
        const { postId } = params;

        const data = await request.formData();
        const content = data.get("content");

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content })
            });

            if( !response.ok )
                throw new Error(`Unable to add a comment to the post ${postId}.`);

            return redirect(`/posts/${postId}`);
        } catch( err ) {
            return { error: err.message || `Unable to add a comment to the post ${postId}.` };
        }
    },
    children: [commentRoute]
};