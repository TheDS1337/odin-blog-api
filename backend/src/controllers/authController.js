
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { body, matchedData, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import authorizationMiddleware from "../middleware/authorizationMiddleware.js";
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";

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

const generateJWT = (res, user) => {
    const expiresIn = parseInt(process.env.JWT_TOKEN_LIFETIME);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * expiresIn
    });
};

const readMe = [
    authorizationMiddleware,
    (req, res) => {
        const { password, ...data } = req.user;
        return res.status(200).json(data);
    }
];

const signup = [
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
            return res.status(400).json({ error: errors.array() });

        // We now push the created user into the database
        try {
            const { password, confirmPassword, ...validatedData } = matchedData(req);
            const user = await prisma.user.create({ data: {
                    ...validatedData,
                    password: await bcrypt.hash(password, 10),
                    isAdmin: validatedData.username === process.env.ADMIN_USERNAME
                }
            });

            generateJWT(res, user);

            res.status(201).json({ message: `A new user ${user.username} was added to the database.`, user });
        } catch( error ) {
            res.status(500).json({ error: "Something went wrong in user signup." });
        }
    }
];

const login = [
    authenticationMiddleware,
    (req, res) => {
        const user = req.user;
        generateJWT(res, user);

        res.status(200).json({ message: `User ${user.username} just logged in and a JWT was created.` });
    }
];

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    res.sendStatus(204);
};

export default {
    readMe,
    signup,
    login,
    logout
};