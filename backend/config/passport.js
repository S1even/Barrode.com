const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/user.model");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  accessType: "offline",
  prompt: "consent"
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Extraction du vrai refresh_token (parfois nested dans un objet)
    const cleanRefreshToken = typeof refreshToken === "object"
      ? refreshToken?.refresh_token
      : refreshToken;

    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {
      user = await UserModel.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0].value,
        refreshToken: typeof cleanRefreshToken === "string" ? cleanRefreshToken : undefined
      });
    } else if (typeof cleanRefreshToken === "string") {
      user.refreshToken = cleanRefreshToken;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
