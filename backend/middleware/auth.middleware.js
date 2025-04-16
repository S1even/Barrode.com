import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.clearCookie("jwt");
                return next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                return next();
            }
        });
    } else {
        res.locals.user = null;
        return next();
    }
};

export const requireAuth = async (req, res, next) => {
    let token;
  
    // Priorité au header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      // Fallback sur cookie
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return res.status(401).json({ message: "Accès refusé, pas de token" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log("Utilisateur authentifié :", decoded.id);
  
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }
  
      req.user = user; // On stocke l'objet utilisateur dans req.user
      res.locals.user = user;
      next();
    } catch (err) {
      console.log("Erreur JWT :", err);
      return res.status(403).json({ message: "Token invalide" });
    }
};

  