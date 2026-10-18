import { Router } from "express";
import prisma from "../lib/prisma.js";
import commentsRouter from "./commentsRouter.js";

const checkIfAdmin = (req, res, next) => {
    const user = req.user;

    if( user.isAdmin )
        return next();
    
    res.status(401).json({ message: `User '${user.username}' does not have access to this functionality.` });
}

const router = Router();

router.get("/{:postId}", async (req, res) => {
    const id = req.params.postId;

    if( !id )
        return res.status(200).json(await prisma.post.findMany());
    
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if( post )
        return res.status(200).json(post);

    res.status(404).json({ message: `No post with id=${id} was found.` });
});

router.post("/", checkIfAdmin, async (req, res) => {
    const post = await prisma.post.create({ data: {
        title: req.body.title,
        content: req.body.content,
        authorId: req.user.id
    } });

    res.status(201).json({ message: `New post titled '${post.title}' was created by user '${req.user.username}'.`, post });
});

router.put("/:postId", checkIfAdmin, async (req, res) => {
    const id = req.params.postId;
    const oldPost = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if( !oldPost )
        return res.status(404).json({ message: `No post with id=${id} was found.` });

    try {
        const post = await prisma.post.update({ where: { id: parseInt(id) }, data: {
            title: req.body.title,
            content: req.body.content
        } });

        res.status(201).json({ message: `Old post titled '${oldPost.title}' was updated by user '${req.user.username}'.`, post });
    } catch( error ) {
        res.status(404).json({ message: `Old post titled '${oldPost.title}' was deleted before it could be updated.` });
    }
});

router.delete("/:postId", checkIfAdmin, async (req, res) => {
    const id = req.params.postId;
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

    if( !post )
        return res.status(404).json({ message: `No post with id=${id} was found.` });

    try {
        await prisma.post.delete({ where: { id: parseInt(id) } });

        res.status(201).json({ message: `Post titled '${post.title}' was deleted by user '${req.user.username}'.` });
    } catch( error ) {
        res.status(404).json({ message: `Post titled '${post.title}' was already deleted.` });
    }
});

router.use("/:postId/comments", commentsRouter);

export default router;