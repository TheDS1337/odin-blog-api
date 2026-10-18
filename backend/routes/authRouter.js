import { Router } from "express";
import prisma from "../lib/prisma.js";
import { body, matchedData, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { authenticationMiddleware, loginMiddleware, logoutMiddleware } from "../passport.config.js";

const validateCapitalizedName = name => {
    const firstLetter = name.charAt(0);

    if( firstLetter !== firstLetter.toUpperCase() )
        throw new Error("Names should generally start with a capital letter.");

    return true;
}

const validateUsername = async username => {
    const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
    });

    // This username already existed in our database
    if( user )
        throw new Error("This user already exists.");

    // A username should be be made purely from numbers, as to not confuse the search in api/users/
    if( !/[A-Z]/.test(username) && !/[a-z]/.test(username) )
        throw new Error('Username must contain at least one letter.');

    return true;
};

const validatePassword = password => {
    // Must contain at least one uppercase letter
    if( !/[A-Z]/.test(password) )
        throw new Error('Password must contain at least one uppercase letter.');

    // Must contain at least one lowercase letter
    if( !/[a-z]/.test(password) )
        throw new Error('Password must contain at least one lowercase letter.');

    // Must contain at least one number
    if( !/\d/.test(password) )
        throw new Error('Password must contain at least one number.');

    // Must contain at least one special character
    if( !/[!@#$%^&*(),.?":{}|<>]/.test(password) )
        throw new Error('Password must contain at least one special character.');

    return true;
}

const validatePasswordConfirmation = (password, { req }) => {
    if( password !== req.body.password )
        throw new Error('Password mismatch.');

    return true;
}

const signupMiddleware = [
    body("firstName").trim()
        .notEmpty().withMessage("First name is required.")
        .isAlpha().withMessage("First name must contain only letters.")
        .isLength({ min: 1, max: 32 }).withMessage("First name should be between 1 and 32 characters long.")
        .custom(validateCapitalizedName),

    body("lastName").trim()
        .notEmpty().withMessage("Last name is required.")
        .isAlpha().withMessage("Last name must contain only letters.")
        .isLength({ min: 1, max: 32 }).withMessage("Last name should be between 1 and 32 characters long.")
        .custom(validateCapitalizedName),

    body("username")
        .notEmpty().withMessage("Username is required.")
        .isLength({ min: 1, max: 32 }).withMessage("Username should be between 1 and 32 characters long.")
        .custom(validateUsername),

    body("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 4, max: 32 }).withMessage("Password should be between 4 and 32 characters long.")
        .custom(validatePassword),

    body("confirmPassword")
        .custom(validatePasswordConfirmation),

    async (req, res) => {
        // Check if the previous middlewares threw any validation errors
        const errors = validationResult(req);

        if( !errors.isEmpty() ) 
            return res.status(400).json({ errors: errors.array() });

        // We now push the created user into the database
        try {
            const { password, confirmPassword, ...data } = matchedData(req);
            const user = { ...data, password: await bcrypt.hash(password, 10), isAdmin: data.username === "theds1337" };
            await prisma.user.create({ data: user });

            res.status(201).json({ message: `A new user ${user.username} was added to the database.`, user });
        } catch (error) {
            res.status(500).json({ error: { message: "Something went wrong in signup.", ...error }});
        }
    }
];

const router = Router();

router.get("/me", authenticationMiddleware, (req, res) => res.status(200).json({ message: `User ${req.user.username} is currently logged in.` }));

router.post("/signup", signupMiddleware);
router.post("/login", loginMiddleware);
router.post("/logout", logoutMiddleware);

export default router;