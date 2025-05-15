passport.serializeUser((user, done) => {
  try {
    let userId;
    
    if (user._id) {

      userId = user._id.toString();
    } else if (user.id) {

      userId = user.id.toString();
    } else if (user.googleId) {

      userId = user.googleId.toString();
    } else {

      console.error("Impossible de sérialiser l'utilisateur : aucun ID trouvé", user);
      return done(new Error("Pas d'ID utilisateur à sérialiser"), null);
    }
    
    console.log("Sérialisation utilisateur avec ID:", userId);
    done(null, userId);
  } catch (error) {
    console.error("Erreur lors de la sérialisation de l'utilisateur:", error);
    done(error, null);
  }
});


passport.deserializeUser(async (id, done) => {
  try {
    console.log("Désérialisation de l'utilisateur avec ID:", id);
    

    let user = await UserModel.findById(id);
    

    if (!user) {
      console.log("Utilisateur non trouvé par _id, recherche par googleId...");
      user = await UserModel.findOne({ googleId: id });
    }
    

    if (!user) {
      console.error("Désérialisation échouée : Utilisateur non trouvé avec ID:", id);
      return done(null, false);
    }
    
    console.log("Utilisateur désérialisé avec succès:", user._id);

    done(null, user.toObject());
  } catch (err) {
    console.error("Erreur lors de la désérialisation de l'utilisateur:", err);
    done(err, null);
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  accessType: "offline",
  prompt: "consent"
}, async (req, accessToken, refreshToken, profile, done) => {
  try {

    const cleanRefreshToken = typeof refreshToken === "object"
      ? refreshToken?.refresh_token
      : refreshToken;

    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {

      user = await UserModel.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,      
        pseudo: profile.displayName,     
        picture: profile.photos[0].value,
        refreshToken: typeof cleanRefreshToken === "string" ? cleanRefreshToken : undefined
      });
      console.log("Nouvel utilisateur Google créé avec ID:", user._id);
    } else if (typeof cleanRefreshToken === "string") {
      user.refreshToken = cleanRefreshToken;
      

      if (!user.pseudo && user.name) {
        user.pseudo = user.name;
      }
      
      await user.save();
      console.log("Utilisateur Google existant mis à jour avec ID:", user._id);
    }


    const userObj = user.toObject();
    console.log("Stratégie Google terminée, utilisateur:", userObj._id);
    return done(null, userObj);
  } catch (err) {
    console.error("Erreur d'authentification Google:", err);
    done(err, null);
  }
}));