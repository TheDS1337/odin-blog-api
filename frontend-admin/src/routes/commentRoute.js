import editCommentRoute from "./editCommentRoute.js";
import removeCommentRoute from "./removeCommentRoute.js";

export default {
    path: ":commentId",
    children: [
        editCommentRoute,
        removeCommentRoute
    ]
};