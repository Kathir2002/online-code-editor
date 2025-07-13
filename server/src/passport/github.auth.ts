import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/api/auth/github/callback",
      scope: ['repo', 'user'] // Ask for repo access
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {      
      // Check if user already exists
      const user = await User.findOne({ username: profile.username });
      // signup
      if (!user) {
        const newUser = new User({
          name: profile.displayName,
          username: profile.username,
          picture: profile.photos[0].value, // Use the first photo URL
          savedCodes: [],
          email: profile.emails[0].value, // GitHub provides email in the profile
          isFromGithub: true, // Mark as GitHub user
          profileUrl: profile.profileUrl, // Store GitHub profile URL
          githubAccessToken: accessToken, // Store GitHub access token
        });
        await newUser.save();

        done(null, newUser);
      } else {
        done(null, user);
      }
    }
  )
);
