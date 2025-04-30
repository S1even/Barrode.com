const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");
const MongoStore = require('connect-mongo');

const port = process.env.PORT || 5001;
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

connectDB();

const app = express();

// Configuration CORS adaptée pour production
const corsOptions = {
  origin: process.env.CLIENT_URL || "https://barrode-com.vercel.app",
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

// Configuration de session adaptée à l'environnement
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || "monSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    httpOnly: true,
    // En production on met secure: true, mais pour le debug on peut le mettre à false
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 jour
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

// Route par défaut pour la vérification de la santé du service
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Gestion d'erreur globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// Démarrage du serveur avec gestion d'erreur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Error starting server:', err.message);
});