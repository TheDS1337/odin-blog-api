import passport from "../lib/passport.js";

export default passport.authenticate("jwt", { session: false });