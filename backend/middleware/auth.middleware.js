const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
          if (err) {
              res.locals.user = null;
              res.clearCookie("jwt");
              return next();
          } else {
              let user = await UserModel.findById(decodedToken.id);
              
              // Normalisation des données utilisateur
              if (user) {
                  // Si l'utilisateur a un name mais pas de pseudo (cas Google), utilisez name comme pseudo
                  if (!user.pseudo && user.name) {
                      user.pseudo = user.name;
                  }
                  
                  // Assurez-vous que le pseudo est inclus dans les données utilisateur
                  res.locals.user = {
                      ...user._doc,
                      pseudo: user.pseudo || user.name // Fallback au name si nécessaire
                  };
              } else {
                  res.locals.user = null;
              }
              
              return next();
          }
      });
  } else {
      res.locals.user = null;
      return next();
  }
};

exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? 
    req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = {
      _id: decodedToken.id.toString()
    };
    
    // Important: stocker l'ID et l'utilisateur complet
    const user = await UserModel.findById(decodedToken.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    req.user = user; // Stocker l'utilisateur complet
    res.locals.user = user;
    
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide" });
  }
};