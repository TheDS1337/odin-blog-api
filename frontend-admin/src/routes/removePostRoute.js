import { redirect } from "react-router";

export default {
    path: "remove",
    action: async ({ params }) => {
        const { postId } = params;

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if( !response.ok )
                throw new Error(`Unable to remove the post ${postId}.`);

            return redirect("/");
        } catch( err ) {
            return { error: err.message || `Unable to remove the post ${postId}.` };
        }
    }
};