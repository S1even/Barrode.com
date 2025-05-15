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
      // Lors de la création d'un nouvel utilisateur Google, assignez displayName à pseudo
      user = await UserModel.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        pseudo: profile.displayName,
        picture: profile.photos[0].value,
        refreshToken: typeof cleanRefreshToken === "string" ? cleanRefreshToken : undefined
      });
      
      // Vérifier que l'utilisateur a bien été créé avec un ID MongoDB
      console.log("Nouvel utilisateur Google créé avec ID:", user._id);
    } else if (typeof cleanRefreshToken === "string") {
      user.refreshToken = cleanRefreshToken;
      
      // Si l'utilisateur existe mais n'a pas de pseudo, ajoutez-le
      if (!user.pseudo && user.name) {
        user.pseudo = user.name;
      }
      
      await user.save();
      console.log("Utilisateur Google existant mis à jour avec ID:", user._id);
    }

    // Conversion explicite en objet simple pour éviter les problèmes avec les documents Mongoose
    const userObj = user.toObject();
    return done(null, userObj);
  } catch (err) {
    console.error("Erreur d'authentification Google:", err);
    done(err, null);
  }
}));