import passport from "../lib/passport.js";

export default passport.authenticate("local", { session: false });