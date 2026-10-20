import prisma from "./prisma.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcryptjs";

passport.use(new LocalStrategy({    
        /*
        * This is the default setting, but it's just here to help me
        *   better understand how the strategy pickup from req.body
        */ 
        usernameField: 'username',
        passwordField: 'password'
    },
    async( username, password, done ) => {
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
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: req =>  req?.cookies?.token,
        secretOrKey: process.env.JWT_SECRET
    },
    async( { id }, done ) => {
        try {
            const user = await prisma.user.findUnique({ where: { id } });

            return done(null, user || false);
        } catch( error ) {
            return done(error, false);
        }
    }
));

export default passport;