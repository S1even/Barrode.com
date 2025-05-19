
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


const maxAge = 3 * 24 * 60 * 60; // 3 jours en secondes
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: `${maxAge}s` });
};


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login-error`,
  }),
  (req, res) => {
    try {
      console.log("Google auth successful, user:", {
        id: req.user._id,
        pseudo: req.user.pseudo || req.user.name,
        email: req.user.email
      });


      const token = createToken(req.user._id);
      

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
      });
      

      res.redirect(`${process.env.CLIENT_URL}/feed`);
    } catch (err) {
      console.error("Erreur lors de la création du JWT après Google Auth:", err);
      res.redirect(`${process.env.CLIENT_URL}/login-error`);
    }
  }
);

module.exports = router;