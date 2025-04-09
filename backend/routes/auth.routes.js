const router = require("express").Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  accessType: "offline",
  prompt: "consent"
}));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  session: true
}), (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
