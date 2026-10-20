import prisma from "../lib/prisma.js";
import adminCheckMiddleware from "../middleware/adminCheckMiddleware.js";

const readPost = async (req, res) => {
    const id = req.params.postId;

    if( !id ) {        
        const { authorId, username } = req.query;

        if( authorId && /^\d+$/.test(authorId) )       
            return res.status(200).json(await prisma.post.findMany({ where: { authorId: parseInt(authorId) }}));
        else if( username )      
            return res.status(200).json(await prisma.post.findMany({ where: { author: { username } }}));

        return res.status(200).json(await prisma.post.findMany());
    }

    if( /^\d+$/.test(id) ) {
        const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

        if( post )
            return res.status(200).json(post);
    }

    res.status(404).json({ message: `No post with id=${id} was found.` });
};

const createPost = [
    adminCheckMiddleware,
    async (req, res) => {
        const callingUser = req.user;
        const post = await prisma.post.create({ data: {
            title: req.body.title,
            content: req.body.content,
            authorId: callingUser.id
        } });

        res.status(201).json({ message: `New post titled '${post.title}' was created by user '${callingUser.username}'.`, post });
    }
];

const updatePost = [
    adminCheckMiddleware,
    async (req, res) => {
        const id = req.params.postId;

        if( /^\d+$/.test(id) ) {
            const oldPost = await prisma.post.findUnique({ where: { id: parseInt(id) } });

            if( oldPost ) {
                const callingUser = req.user;

                if( callingUser.id !== oldPost.authorId && oldPost.author.isAdmin )
                    return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

                try {
                    const post = await prisma.post.update({ where: { id: oldPost.id }, data: {
                        title: req.body.title,
                        content: req.body.content
                    } });

                    res.status(201).json({ message: `Old post titled '${oldPost.title}' was updated by user '${callingUser.username}'.`, post });
                } catch( error ) {
                    res.status(404).json({ message: `Old post titled '${oldPost.title}' was deleted before it could be updated.` });
                }
            }
        }

        return res.status(404).json({ message: `No post with id=${id} was found.` }); 
    }
];

const deletePost = [
    adminCheckMiddleware,
    async (req, res) => {
        const id = req.params.postId;

        if( /^\d+$/.test(id) ) {
            const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });

            if( post ) {
                const callingUser = req.user;

                if( callingUser.id !== post.authorId && post.author.isAdmin )
                    return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

                try {
                    await prisma.post.delete({ where: { id: post.id } });

                    res.status(201).json({ message: `Post titled '${post.title}' was deleted by user '${callingUser.username}'.` });
                } catch( error ) {
                    res.status(404).json({ message: `Post titled '${post.title}' was already deleted.` });
                }
            }
        }

        return res.status(404).json({ message: `No post with id=${id} was found.` });
    }
]

export default {
    readPost,
    createPost,
    updatePost,
    deletePost
};