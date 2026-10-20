import prisma from "../lib/prisma.js";

const readMe = async (req, res) => res.status(200).json(await prisma.user.findUnique({ where: { id: req.user.id }, omit: { password: true } }));

const updateMe = async (req, res) => {
    const { id, username } = req.user;

    try {
        const user = await prisma.user.update({ where: { id }, data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        } });

        res.status(201).json({ message: `User '${username}' updated himself.`, user });
    } catch( error ) {
        res.status(404).json({ message: `User '${username}' was deleted before it could have updated itself.` });
    }
};

const deleteMe = async (req, res) => {
    const { id, username } = req.user;

    try {
        await prisma.user.delete({ where: { id } });

        res.status(201).json({ message: `User '${username}' deleted himself.` });
    } catch( error ) {
        res.status(404).json({ message: `User '${username}' was already deleted.` });
    }
};

const readUser = async (req, res) => {
    const id = req.params.userId;
    const callingUser = req.user;

    if( !id )
        return res.status(200).json(await prisma.user.findMany({ omit: { password: !callingUser.isAdmin } }));
    
    const user = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id }, omit: { password: !callingUser.isAdmin } });

    if( user )
        return res.status(200).json(user);

    res.status(404).json({ message: `No user with id=${id} was found.` });
};

const updateUser = async (req, res) => {
    const id = req.params.userId;
    const oldUser = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id } });

    if( !oldUser ) 
        return res.status(404).json({ message: `No user with id=${id} was found.` });

    const callingUser = req.user;

    if( callingUser.id !== oldUser.id && (!callingUser.isAdmin || oldUser.isAdmin) )
        return res.status(401).json({ message: `User '${user.username}' does not have access to this functionality.` });

    try {
        const user = await prisma.user.update({ where: { id: oldUser.id }, data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        } });

        res.status(201).json({ message: `Old user '${oldUser.username}' was updated by user '${callingUser.username}'.`, user });
    } catch( error ) {
        res.status(404).json({ message: `Old user '${oldUser.username}' was deleted before it could be updated.` });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.userId;
    const user = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id } });

    if( !user )
        return res.status(404).json({ message: `No user with id=${id} was found.` });

    const callingUser = req.user;

    if( callingUser.id !== user.id && (!callingUser.isAdmin || user.isAdmin) )
        return res.status(401).json({ message: `User '${callingUser.username}' does not have access to this functionality.` });

    try {
        await prisma.user.delete({ where: { id: user.id } });

        res.status(201).json({ message: `User '${user.username}' was deleted by user '${callingUser.username}'.` });
    } catch( error ) {
        res.status(404).json({ message: `User '${user.username}' was already deleted.` });
    }
};

export default {
    readMe,
    updateMe,
    deleteMe,
    readUser,
    updateUser,
    deleteUser
};