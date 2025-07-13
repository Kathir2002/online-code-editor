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

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err: any, user: any) {
//     done(err, user);
//   });
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      callbackURL:
        "http://localhost:8000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      const user = await User.findOne({ email: profile?._json?.email });
      // signup
      if (!user) {
        const newUser = new User({
          username: profile?._json?.name,
          email: profile?._json?.email,
          picture: profile?._json?.picture,
          savedCodes: [],
        });
        await newUser.save();
        done(null, newUser);
      } else {
        done(null, user);
      }
    }
  )
);
