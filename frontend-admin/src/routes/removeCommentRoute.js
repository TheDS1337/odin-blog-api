import { redirect } from "react-router";

export default {
    path: "remove",
    action: async ({ params }) => {
        const { postId, commentId } = params;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if( !response.ok )
                throw new Error(`Unable to remove the comment ${commentId} in the post ${postId}.`);

            return redirect(`/posts/${postId}`);
        } catch( err ) {
            return { error: err.message || `Unable to remove the comment ${commentId} in the post ${postId}.` };
        }
    }
};