const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/user.model");


console.log("Vérification du modèle utilisateur:", 
  UserModel ? "Modèle chargé correctement" : "ERREUR: Modèle non défini");

// Vérifier les champs du schéma si possible
if (UserModel && UserModel.schema) {
  console.log("Champs du schéma utilisateur:", 
    Object.keys(UserModel.schema.paths).join(", "));
}

passport.serializeUser((user, done) => {
  try {
    if (user && user._id) {
      const idStr = user._id.toString();
      console.log("Sérialisation d'utilisateur avec ID:", idStr);
      return done(null, idStr);
    } else if (user && user.id) {
      const idStr = user.id.toString();
      console.log("Sérialisation d'utilisateur avec ID (format alternatif):", idStr);
      return done(null, idStr);
    } else if (user && user.googleId) {
      const idStr = user.googleId.toString();
      console.log("Sérialisation d'utilisateur avec googleId:", idStr);
      return done(null, idStr);
    }
    
    console.error("Erreur de sérialisation: format utilisateur invalide", user);
    return done(new Error("Format utilisateur invalide pour la sérialisation"), null);
  } catch (err) {
    console.error("Exception lors de la sérialisation:", err);
    return done(err, null);
  }
});


passport.deserializeUser((id, done) => {
  try {
    console.log("Tentative de désérialisation avec ID:", id);
    UserModel.findById(id)
      .then(user => {
        if (!user) {
          console.log("Utilisateur non trouvé par ID, essai avec googleId");
          return UserModel.findOne({ googleId: id });
        }
        return user;
      })
      .then(user => {
        if (!user) {
          console.log("Utilisateur introuvable lors de la désérialisation");
          return done(null, false);
        }
        
        console.log("Utilisateur désérialisé avec succès:", user._id);
        return done(null, user);
      })
      .catch(err => {
        console.error("Erreur lors de la désérialisation:", err);
        return done(err, null);
      });
  } catch (err) {
    console.error("Exception lors de la désérialisation:", err);
    return done(err, null);
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  accessType: "offline",
  prompt: "consent",
  // Ajouter ces options peut aider dans certains cas
  passReqToCallback: true,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log("Authentification Google en cours pour:", profile.id);
    
    // Extraction du vrai refresh_token (parfois nested dans un objet)
    const cleanRefreshToken = typeof refreshToken === "object"
      ? refreshToken?.refresh_token
      : refreshToken;

    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {
      console.log("Création d'un nouvel utilisateur Google");
      // Lors de la création d'un nouvel utilisateur Google
      const newUser = {
        googleId: profile.id,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        name: profile.displayName || '',
        pseudo: profile.displayName || '',
        picture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
        refreshToken: typeof cleanRefreshToken === "string" ? cleanRefreshToken : undefined
      };
      
      user = await UserModel.create(newUser);
      console.log("Nouvel utilisateur Google créé avec ID:", user._id);
    } else {
      console.log("Utilisateur Google existant trouvé:", user._id);
      
      if (typeof cleanRefreshToken === "string") {
        user.refreshToken = cleanRefreshToken;
      }
      
      // Si l'utilisateur existe mais n'a pas de pseudo, ajoutez-le
      if (!user.pseudo && user.name) {
        user.pseudo = user.name;
      }
      
      await user.save();
    }

    // Passer l'utilisateur tel quel sans conversion
    return done(null, user);
  } catch (err) {
    console.error("Erreur d'authentification Google:", err);
    return done(err, null);
  }
}));