const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = 5001;


connectDB();

const app = express();


// Middleware traite données Request
app.use(express.json());
app.use(express.urlencoded({extended: false }));

app.use("/post", require("./routes/post.routes"));

// Start server
app.listen(port, () => console.log("Le serveur a démarré au port " + port));