import { redirect } from "react-router";

export default {
    path: "edit",
    action: async ({ request, params }) => {
        const { postId } = params;

        const data = await request.formData();
        const { title, content } = Object.fromEntries(data.entries());

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title, content })
            });

            if( !response.ok )
                throw new Error(`Unable to edit the post ${postId}.`);

            return redirect(`/posts/${postId}`);
        } catch( err ) {
            return { error: err.message || `Unable to edit the post ${postId}.` };
        }
    }
};