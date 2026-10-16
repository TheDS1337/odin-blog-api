import { Router } from "express";
import { protectionMiddleware } from "../passport.config.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use(protectionMiddleware, (req, res) => {
    if( !req.user )
        return res.status(401).json({ error: { message: "You are not authorized to use this route." } });

    const { password, user } = req.user;
    res.status(200).json({ message: `User ${user.username} accessed API route.`, user });
});

router.use("/auth", authRouter);

export default router;