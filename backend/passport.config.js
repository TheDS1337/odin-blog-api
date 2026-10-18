import prisma from "./lib/prisma.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

passport.use(new LocalStrategy({    
        /*
        * This is the default setting, but it's just here to help me
        *   better understand how the strategy pickup from req.body
        */ 
        usernameField: 'username',
        passwordField: 'password'
    }, async( username, password, done ) => {
        try {
            const user = await prisma.user.findUnique({ where: { username } });

            if( !user )
                return done(null, false, { message: "Incorrect username" });
            
            if( !await bcrypt.compare(password, user.password) )
                return done(null, false, { message: "Incorrect password" });

            return done(null, user);
        } catch(err) {
            return done(err);
        }
    }));

passport.use(new JWTStrategy({
            jwtFromRequest: req => req && req.cookies ? req.cookies['token'] : null,
            secretOrKey: process.env.JWT_SECRET
        }, async( { id }, done ) => {
            try {
                const user = await prisma.user.findUnique({ where: { id } });

                return done(null, user || false);
            } catch( error ) {
                return done(error, false);
            }
        }));

const loginMiddleware = [
    passport.authenticate("local", { session: false }),
    (req, res) => {
        const { id, username } = req.user;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 600000           // 10 minutes in milliseconds
        });
    
        res.status(200).json({ message: `User ${username} logged in and a JWT was created.`, token });
    }
]

const logoutMiddleware = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    res.sendStatus(204);
}

const authenticationMiddleware = passport.authenticate("jwt", { session: false });
const initializePassport = () => passport.initialize();

export { initializePassport, loginMiddleware, logoutMiddleware, authenticationMiddleware };