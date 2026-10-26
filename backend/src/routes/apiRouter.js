import { Router } from "express";
import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";
import commentsRouter from "./commentsRouter.js";
import authorizationMiddleware from "../middleware/authorizationMiddleware.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

export default router;