import GoogleStrategyPassport from "passport-google-oauth2";
import passport from "passport";
import User from "../models/userModel";

const GoogleStrategy = GoogleStrategyPassport.Strategy;
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

// passport.deserializeUser((obj: any, done) => {
//   done(null, obj);
// });
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err: any, user: any) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      callbackURL:
        "https://online-code-editor.cyclic.app/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      const userByEmail = await User.findOne({ email: profile?._json?.email });
      const userByName = await User.findOne({
        username: profile?.profile?._json?.name,
      });
      // signup
      if (!userByEmail || !userByName) {
        const newUser = new User({
          username: profile?._json?.name,
          email: profile?._json?.email,
          picture: profile?._json?.picture,
          savedCodes: [],
        });
        await newUser.save();
        done(null, newUser);
      } else {
        done(null, userByEmail ? userByEmail : userByName);
      }
    }
  )
);
