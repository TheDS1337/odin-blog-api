import { redirect } from "react-router";

export default {
    path: "edit",
    action: async ({ request, params }) => {
        const { postId, commentId } = params;

        const data = await request.formData();
        const content = data.get("content");

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content })
            });

            if( !response.ok )
                throw new Error(`Unable to edit the comment ${commentId} in the post ${postId}.`);

            return redirect(`/posts/${postId}`);
        } catch( err ) {
            return { error: err.message || `Unable to edit the comment ${commentId} in the post ${postId}.` };
        }
    }
};