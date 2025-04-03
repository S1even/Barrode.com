const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.checkUser = (req, res, next) => {
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

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Accès refusé, pas de token" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log("Erreur JWT :", err);
            return res.status(403).json({ message: "Token invalide" });
        }

        console.log("Utilisateur authentifié :", decodedToken.id);
        let user = await UserModel.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.locals.user = user;
        return next();
    });
};
