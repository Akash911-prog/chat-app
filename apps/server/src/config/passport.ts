import passport from "passport";
import { Strategy as LocalStratergy } from "passport-local";
import bcrypt from "bcrypt";

passport.use(new LocalStratergy(function verify(username, password, cb) {}));
