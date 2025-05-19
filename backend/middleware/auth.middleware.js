const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


const normalizeUserId = async (id) => {
  if (!id) return null;
  
  try {

    let user = await UserModel.findById(id);
    

    if (!user) {
      user = await UserModel.findOne({ googleId: id });
    }
    
    return user ? user._id : null;
  } catch (err) {
    console.error("Erreur de normalisation d'ID:", err);
    return null;
  }
};

exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  res.locals.user = null;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;
    

    let user = await UserModel.findById(userId);
    

    if (!user && userId.length > 15) {
      user = await UserModel.findOne({ googleId: userId });
    }
    
    if (user) {

      if (!user.pseudo && user.name) {
        user.pseudo = user.name;
        await user.save();
      }
      

      res.locals.user = user;
    }
    
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    res.clearCookie("jwt");
    next();
  }
};

exports.requireAuth = async (req, res, next) => {

  const token = req.cookies.jwt || 
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? 
      req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.id;
    

    let user = await UserModel.findById(userId);
    

    if (!user && userId.length > 15) {
      user = await UserModel.findOne({ googleId: userId });
    }
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }


    req.user = user;
    res.locals.user = user;
    
    next();
  } catch (err) {
    console.error("Erreur d'authentification:", err);
    return res.status(403).json({ message: "Token invalide" });
  }
};