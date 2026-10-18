import { Router } from "express";
import { authenticationMiddleware } from "../passport.config.js";
import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";
import commentsRouter from "./commentsRouter.js";

const router = Router();

router.use("/auth", authRouter);

// All routes after this require authentication
router.use(authenticationMiddleware);

// One of the front-end sites will be for people that want to read and comment on your posts
// while the other one will be just for you to write, edit and publish your posts.
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", (req, res, next) => {
    const user = req.user;

    if( user.isAdmin )
        return next();
    
    res.status(401).json({ message: `User '${user.username}' does not have access to this functionality.` });
}, commentsRouter);

// Just for debugging purposes, to be tweaked later.
router.all("/", (req, res) => {
    const { password, ...user } = req.user;
    res.status(200).json({ message: `User ${user.username} accessed API route.`, user });
});

export default router;