// Dans auth.routes.js
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: `${maxAge}s` });
};

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  accessType: "offline",
  prompt: "consent"
}));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  session: true
}), (req, res) => {
  // Création du JWT
  const token = createToken(req.user._id);
  
  // Configuration du cookie JWT
  res.cookie('jwt', token, { 
    httpOnly: true, 
    maxAge: maxAge * 1000, 
    secure: true,
    sameSite: 'none'
  });
  
  // Log pour debugging
  console.log("Google auth successful, user:", {
    id: req.user._id,
    pseudo: req.user.pseudo || req.user.name, // Utilisez pseudo ou name si disponible
    email: req.user.email
  });
  
  // Redirection vers le frontend
  res.redirect(`${process.env.CLIENT_URL}/feed`);
});

module.exports = router;