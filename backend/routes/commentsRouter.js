import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router({ mergeParams: true });

router.get("/{:commentId}", async (req, res, next) => {
    if( req.params.postId )
        return next();

    const id = req.params.commentId;

    if( !id ) {
        const { authorId, username, postId } = req.query;

        if( authorId && /^\d+$/.test(authorId) ) {
            if( postId && /^\d+$/.test(postId) )
                return res.status(200).json(await prisma.comment.findMany({ where: { authorId: parseInt(authorId), postId: parseInt(postId) }}));
            else
                return res.status(200).json(await prisma.comment.findMany({ where: { authorId: parseInt(authorId) }}));
        } else if( username ) {
            if( postId && /^\d+$/.test(postId) )
                return res.status(200).json(await prisma.comment.findMany({ where: { author: { username }, postId: parseInt(postId) }}));
            else
                return res.status(200).json(await prisma.comment.findMany({ where: { author: { username } }}));
        }

        return res.status(200).json(await prisma.comment.findMany());
    }

    if( /^\d+$/.test(id) ) {
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

        if( comment )
            return res.status(200).json(comment);
    }

    res.status(404).json({ message: `No comment with id=${id} was found.` });
});

router.post("/", async (req, res, next) => {
    const postId = req.params.postId;

    if( !postId )
        return next();

    const callingUser = req.user;
    const comment = await prisma.comment.create({ data: {
        content: req.body.content,
        authorId: callingUser.id,
        postId: parseInt(postId)
    } });

    res.status(201).json({ message: `New comment to the post ${postId} was added by user '${callingUser.username}'.`, comment });
});

router.put("/:commentId", async (req, res, next) => {
    if( req.params.postId )
        return next();

    const id = req.params.commentId;

    if( /^\d+$/.test(id) ) {
        const oldComment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

        if( oldComment ) {
            const callingUser = req.user;

            if( callingUser.id !== oldComment.authorId && (!callingUser.isAdmin || oldComment.author.isAdmin) )
                return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

            try {
                const comment = await prisma.comment.update({ where: { id: oldComment.id }, data: {
                    content: req.body.content
                } });

                res.status(201).json({ message: `Old comment '${oldComment.id}' on the post ${oldComment.postId} was updated by user '${callingUser.username}'.`, comment });
            } catch( error ) {
                res.status(404).json({ message: `Old comment '${oldComment.id}' on the post ${oldComment.postId} was deleted before it could be updated.` });
            }
        }
    }

    return res.status(404).json({ message: `No comment with id=${id} was found.` });
});

router.delete("/:commentId", async (req, res, next) => {
    if( req.params.postId )
        return next();

    const id = req.params.commentId;

    if( /^\d+$/.test(id) ) {
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

        if( comment ) {
            const callingUser = req.user;

            if( callingUser.id !== comment.authorId && (!callingUser.isAdmin || comment.author.isAdmin) )
                return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

            try {
                await prisma.comment.delete({ where: { id: comment.id } });

                res.status(201).json({ message: `Comment '${comment.id}' on the post ${comment.postId} was deleted by user '${callingUser.username}'.` });
            } catch( error ) {
                res.status(404).json({ message: `Comment '${comment.id}' on the post ${comment.postId} was already deleted.` });
            }
        }
    }

    return res.status(404).json({ message: `No comment with id=${id} was found.` });
});

export default router;