export default (req, res, next) => {
    const user = req.user;

    if( user.isAdmin )
        return next();
    
    res.status(401).json({ message: `User '${user.username}' does not have access to this functionality.` });
};