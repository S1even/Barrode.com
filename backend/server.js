const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const {checkUser, requireAuth} = require("./middleware/auth.middleware");

const port = process.env.PORT || 5001;
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");


connectDB();

const app = express();

// Middleware pour traiter les données des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});


app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);


app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));
