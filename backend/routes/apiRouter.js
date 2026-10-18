import { Router } from "express";
import { authenticationMiddleware } from "../passport.config.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use("/auth", authRouter);

// All routes after this require authentication
router.use(authenticationMiddleware);

// Just for debugging purposes, to be tweaked later.
router.all("/", (req, res) => {
    const { password, ...user } = req.user;
    res.status(200).json({ message: `User ${user.username} accessed API route.`, user });
});

export default router;