import { redirect } from "react-router";
import postRoute from "./postRoute.js";

export default {
    path: "posts",
    children: [
        {
            index: true,
            loader: async () => redirect("/")
        },
        postRoute
    ]
};