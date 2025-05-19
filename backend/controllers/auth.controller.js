const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60; // 3 jours en secondes

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: `${maxAge}s` });
};

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email et mot de passe requis" 
      });
    }


    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ 
        message: "Email ou mot de passe incorrect" 
      });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Création du token JWT
    const token = createToken(user._id);


    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });


    const userResponse = {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      bio: user.bio,
      picture: user.picture,
      followers: user.followers,
      following: user.following,
      likes: user.likes
    };

    console.log("Connexion réussie pour l'utilisateur:", {
      id: user._id,
      pseudo: user.pseudo,
      email: user.email
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: userResponse
    });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la connexion",
      error: error.message 
    });
  }
};

module.exports.signUp = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;


    if (!pseudo || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont requis"
      });
    }


    const existingUser = await User.findOne({
      $or: [{ email }, { pseudo }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? "Cet email est déjà utilisé" 
          : "Ce pseudo est déjà utilisé"
      });
    }


    const user = await User.create({
      pseudo,
      email,
      password
    });


    const token = createToken(user._id);

    // Configuration du cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    const userResponse = {
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      bio: user.bio || "",
      picture: user.picture || "./uploads/profil/random-user.png",
      followers: user.followers || [],
      following: user.following || [],
      likes: user.likes || []
    };

    console.log("Inscription réussie pour l'utilisateur:", {
      id: user._id,
      pseudo: user.pseudo,
      email: user.email
    });

    res.status(201).json({
      message: "Inscription réussie",
      user: userResponse
    });

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email ou pseudo déjà utilisé"
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Erreur de validation",
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: "Erreur serveur lors de l'inscription",
      error: error.message
    });
  }
};