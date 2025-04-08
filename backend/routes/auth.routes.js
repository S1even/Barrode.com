const router = require("express").Router();
const passport = require("passport");

// Démarre l'auth Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback après autorisation
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/home", // ou ta page principale
  failureRedirect: "/login"
}));

module.exports = router;
