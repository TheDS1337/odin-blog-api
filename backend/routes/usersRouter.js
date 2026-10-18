import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/me", async (req, res) => {
    const me = req.user;
    const user = await prisma.user.findUnique({ where: { id: me.id }, omit: { password: true } });

    if( user )
        return res.status(200).json(user);

    res.status(404).json({ message: `No user with id=${me.id} was found.` });
});

router.get("/{:userId}", async (req, res) => {
    const id = req.params.userId;

    if( !id )
        return res.status(200).json(await prisma.user.findMany({ omit: { password: !req.user.isAdmin } }));
    
    const user = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id }, omit: { password: !req.user.isAdmin } });

    if( user )
        return res.status(200).json(user);

    res.status(404).json({ message: `No user with id=${id} was found.` });
});

// Same as signup?
//router.post("/");

router.put("/:userId", async (req, res) => {
    const id = req.params.userId;
    const oldUser = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id }, omit: { password: !req.user.isAdmin } });

    if( !oldUser ) 
        return res.status(404).json({ message: `No user with id=${id} was found.` });

    try {
        const user = await prisma.user.update({ where: { id: oldUser.id }, data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        } });

        res.status(201).json({ message: `Old user '${oldUser.username}' was updated by user '${req.user.username}'.`, user });
    } catch( error ) {
        res.status(404).json({ message: `Old user '${oldUser.username}' was deleted before it could be updated.` });
    }
});

router.delete("/:userId", async (req, res) => {
    const id = req.params.userId;
    const user = await prisma.user.findUnique({ where: /^\d+$/.test(id) ? { id: parseInt(id) } : { username: id } });

    if( !user )
        return res.status(404).json({ message: `No user with id=${id} was found.` });

    try {
        await prisma.user.delete({ where: { id: user.id } });

        res.status(201).json({ message: `User '${user.username}' was deleted by user '${req.user.username}'.` });
    } catch( error ) {
        res.status(404).json({ message: `User '${user.username}' was already deleted.` });
    }
});

export default router;