import editCommentRoute from "./editCommentRoute.js";

export default {
    path: ":commentId",
    children: [
        editCommentRoute
    ]
};