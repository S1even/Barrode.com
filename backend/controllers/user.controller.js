const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
}

module.exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
  
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }
  
      // Générer un access token
      const token = jwt.sign(
        { id: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: "3d" }
      );
  
      // Stocker le token dans un cookie httpOnly
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
  
      // Générer un refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
  
      // Stocker le refresh token dans un cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
  
      // Retourner l'utilisateur
      res.status(200).json({
        user: {
          id: user._id,
          pseudo: user.pseudo,
        }
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id);
    }

    try {
        const user = await UserModel.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("ID unknow : " + error);
        res.status(500).send("Server error");
    }
};

// Function Getme
module.exports.getMe = async (req, res) => {
  try {
    // Si req.user est déjà l'objet utilisateur complet
    if (req.user && req.user._id) {
      // Normalisation pour s'assurer que pseudo est défini
      const userData = {
        ...req.user._doc || req.user,
        pseudo: req.user.pseudo || req.user.name // Utiliser name comme fallback si pas de pseudo
      };
      return res.status(200).json(userData);
    }
    
    // Sinon, récupérer depuis l'ID
    const userId = req.user?.id || req.user;
    const user = await UserModel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // Normalisation des données avant de les envoyer
    const userData = {
      ...user._doc,
      pseudo: user.pseudo || user.name // Utiliser name comme fallback si pas de pseudo
    };
    
    res.status(200).json(userData);
  } catch (err) {
    console.error("Erreur getMe:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports.updateUser = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }
    
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message || error });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({ message: "Successfully deleted." });
    } catch (error) {
        return res.status(500).json({ message: error.message || error });
    }
};

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // Add follower list
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add following list
        const updatedFollowedUser = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        if (!updatedFollowedUser) {
            return res.status(404).json({ message: "Followed user not found" });
        }

        res.status(201).json({ message: "Follow successful", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // pull follower list
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnFollow } },
            { new: true, upsert: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // pull following list
        const updatedFollowedUser = await UserModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true }
        );

        if (!updatedFollowedUser) {
            return res.status(404).json({ message: "Followed user not found" });
        }

        res.status(201).json({ message: "UnFollow successful", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.logoutUser = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Déconnexion réussie" });
  };

  module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token manquant" });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Générer un nouveau token
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.TOKEN_SECRET,
        { expiresIn: "3d" } // Durée de validité du nouveau token
      );
  
      // Réponse avec un nouveau cookie contenant le JWT
      res.cookie("jwt", newToken, {
        httpOnly: true, // Empêche l'accès côté client
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3jours en millisecondes
        secure: process.env.NODE_ENV === "production", // Sécurisé en production (https)
        sameSite: "strict" // Empêche l'envoi de cookies dans des requêtes inter-domaines
      });
  
      res.status(200).json({ message: "Token rafraîchi avec succès" });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token :", error);
      res.clearCookie("jwt"); // Nettoyer les cookies
      res.clearCookie("refreshToken");
      res.status(403).json({ message: "Token invalide" });
    }
  };
  