const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");

const port = process.env.PORT || 5001;
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

connectDB();

const app = express();


const corsOptions = {
  origin: process.env.CLIENT_URL || "https://barrode-com.vercel.app/",
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type', 'Authorization'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
  secret: process.env.SESSION_SECRET || "monSecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 jour
    domain: process.env.NODE_ENV === "production" ? '.votre-domaine.com' : undefined
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes d'authentification Google
app.use("/auth", require("./routes/auth.routes"));


// Route pour vérifier le JWT
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});


app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

app.use("/uploads", express.static("uploads"));



app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));