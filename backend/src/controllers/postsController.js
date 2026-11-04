import prisma from "../lib/prisma.js";
import authorizationMiddleware from "../middleware/authorizationMiddleware.js";

const readPost = async (req, res) => {
    const id = req.params.postId;
    const include = { author: { select: { username: true, isAdmin: true } } };

    if( !id ) {        
        const { authorId, username } = req.query;

        if( authorId && /^\d+$/.test(authorId) )       
            return res.status(200).json(await prisma.post.findMany({ where: { authorId: parseInt(authorId) }, include }));
        else if( username )      
            return res.status(200).json(await prisma.post.findMany({ where: { author: { username } } }));

        return res.status(200).json(await prisma.post.findMany({ include }));
    }

    if( /^\d+$/.test(id) ) {
        const post = await prisma.post.findUnique({ where: { id: parseInt(id) }, include });

        if( post )
            return res.status(200).json(post);
    }

    res.status(404).json({ message: `No post with id=${id} was found.` });
};

const createPost = [
    authorizationMiddleware,
    async (req, res) => {
        const callingUser = req.user;

        if( !callingUser.isAdmin )
            return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

        const post = await prisma.post.create({ data: {
            title: req.body.title,
            content: req.body.content,
            authorId: callingUser.id
        } });

        res.status(201).json({ message: `New post titled '${post.title}' was created by user '${callingUser.username}'.`, post });
    }
];

const updatePost = [
    authorizationMiddleware,
    async (req, res) => {
        const id = req.params.postId;
        const include = { author: { select: { isAdmin: true } } };

        if( /^\d+$/.test(id) ) {
            const oldPost = await prisma.post.findUnique({ where: { id: parseInt(id) }, include });

            if( oldPost ) {
                const callingUser = req.user;

                if( callingUser.id !== oldPost.authorId && (!callingUser.isAdmin || oldPost.author.isAdmin) )
                    return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

                try {
                    const { title, content } = req.body;
                    const post = await prisma.post.update({ where: { id: oldPost.id }, data: {
                        title,
                        content
                    } });

                    return res.status(201).json({ message: `Old post titled '${oldPost.title}' was updated by user '${callingUser.username}'.`, post });
                } catch( error ) {
                    return res.status(404).json({ message: `Old post titled '${oldPost.title}' was deleted before it could be updated.` });
                }
            }
        }

        res.status(404).json({ message: `No post with id=${id} was found.` }); 
    }
];

const deletePost = [
    authorizationMiddleware,
    async (req, res) => {
        const id = req.params.postId;
        const include = { author: { select: { isAdmin: true } } };

        if( /^\d+$/.test(id) ) {
            const post = await prisma.post.findUnique({ where: { id: parseInt(id) }, include });

            if( post ) {
                const callingUser = req.user;

                if( callingUser.id !== post.authorId && (!callingUser.isAdmin || post.author.isAdmin) )
                    return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

                try {
                    await prisma.post.delete({ where: { id: post.id } });

                    return res.status(201).json({ message: `Post titled '${post.title}' was deleted by user '${callingUser.username}'.` });
                } catch( error ) {
                    console.log(error);
                    return res.status(404).json({ message: `Post titled '${post.title}' was already deleted.` });
                }
            }
        }

        res.status(404).json({ message: `No post with id=${id} was found.` });
    }
];

export default {
    readPost,
    createPost,
    updatePost,
    deletePost
};