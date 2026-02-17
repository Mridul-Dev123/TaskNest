
import db from "../database/queries.js"
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcrypt";

passport.use(
    new LocalStrategy(
      {usernameField: "username", passwordField:"password"},
      async(username, password, done)=>{
        try{
            const user=await db.searchByusername(username);
            if(!user)
            {
                return done(null, false, {message:"User not found"});
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid)
            {
                return done(null, false, {message:"Incorrect Password"});
            }
            return done(null, user);
        }
        catch(err){
            return done(err);
        }
      }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id,done)=>{
    try{
        const user=await db.getUser(id);
        done(null, user);
    }
    catch(err){
        done(err);
    }
});

export default passport;