import { Router } from "express";
import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";
import commentsRouter from "./commentsRouter.js";
import authorizationMiddleware from "../middleware/authorizationMiddleware.js";

const router = Router();

router.use("/auth", authRouter);

// All routes after are only accessible to logged-in users
router.use(authorizationMiddleware);

// One of the front-end sites will be for people that want to read and comment on your posts
// while the other one will be just for you to write, edit and publish your posts.
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

export default router;