import PostPage from "../pages/PostPage.jsx";
import postCommentsRoute from "./postCommentsRoute.js";

export default {
    path: ":postId",
    loader: async ({ params }) => {
        const { postId } = params;

        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`/api/posts/${postId}`, {
                method: "GET",
                credentials: "include"
            }),
            fetch(`/api/comments?postId=${postId}`, {
                method: "GET",
                credentials: "include"
            })
        ]);

        if( !postResponse.ok )
            throw new Error(`Failed to load post ${postId}.`);
        
        if( !commentsResponse.ok )
            throw new Error(`Failed to load comments for the post ${postId}.`);

        const [post, comments] = await Promise.all([
            postResponse.json(),
            commentsResponse.json()
        ]);

        return { post, comments };
    },
    Component: PostPage,
    children: [postCommentsRoute]
};