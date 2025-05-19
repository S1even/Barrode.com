const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {

    const token = req.cookies.jwt;

    if (!token) {
      console.log("Aucun token JWT trouvé dans les cookies");
      return res.status(401).json({ 
        message: "Token d'authentification requis",
        authenticated: false 
      });
    }


    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Token décodé:", decodedToken);


    const user = await User.findById(decodedToken.id);

    if (!user) {
      console.log("Utilisateur introuvable pour l'ID:", decodedToken.id);
      return res.status(401).json({ 
        message: "Utilisateur introuvable",
        authenticated: false 
      });
    }


    req.user = user;
    console.log("Utilisateur authentifié:", {
      id: user._id,
      pseudo: user.pseudo || user.name,
      email: user.email
    });

    next();

  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);


    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        message: "Token invalide",
        authenticated: false 
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token expiré",
        authenticated: false 
      });
    }

    res.status(500).json({ 
      message: "Erreur serveur lors de l'authentification",
      authenticated: false,
      error: error.message 
    });
  }
};


module.exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(decodedToken.id);
      
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {

    console.log("Erreur lors de l'authentification optionnelle:", error.message);
    next();
  }
};