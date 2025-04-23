const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const port = process.env.PORT || 5001;
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cors = require("cors");

connectDB();

const app = express();

// Auth Google
app.use(session({
  secret: process.env.SESSION_SECRET || "monSecret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", require("./routes/auth.routes"));

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type',  'Authorization'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

// Lancement serveur
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
