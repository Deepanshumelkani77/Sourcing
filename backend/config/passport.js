const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;

        const email =
          profile.emails &&
          profile.emails.length > 0
            ? profile.emails[0].value.toLowerCase()
            : null;

        if (!email) {
          return done(new Error("Google account does not have an email"));
        }

        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";

        // 1. Find user by Google ID
        let user = await User.findOne({
          googleId,
        });

        if (user) {
          return done(null, user);
        }

        // 2. Check whether this email already exists
        user = await User.findOne({
          email,
        });

        if (user) {
          // Existing email/password account.
          // Link Google to this existing account.
          user.googleId = googleId;
          user.emailVerified = true;

          await user.save();

          return done(null, user);
        }

        // 3. Create new Google customer
        user = await User.create({
          firstName,
          lastName,
          email,
          phone: "", // Google accounts don't provide phone
          googleId,
          emailVerified: true,
          authProvider: "google",
          role: "customer",
          password: null,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
