const User = require("../models/user.model");


module.exports.getMe = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ 
        message: "Utilisateur non authentifié",
        authenticated: false 
      });
    }


    const userResponse = {
      _id: req.user._id,
      pseudo: req.user.pseudo || req.user.name,
      email: req.user.email,
      bio: req.user.bio || "",
      picture: req.user.picture || "./uploads/profil/random-user.png",
      followers: req.user.followers || [],
      following: req.user.following || [],
      likes: req.user.likes || [],

      googleId: req.user.googleId || null,
      authProvider: req.user.googleId ? 'google' : 'local'
    };

    console.log("Données utilisateur récupérées:", {
      id: userResponse._id,
      pseudo: userResponse.pseudo,
      email: userResponse.email,
      authProvider: userResponse.authProvider
    });

    res.status(200).json(userResponse);

  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération des données utilisateur",
      error: error.message 
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });


    const normalizedUsers = users.map(user => ({
      _id: user._id,
      pseudo: user.pseudo || user.name,
      email: user.email,
      bio: user.bio || "",
      picture: user.picture || "./uploads/profil/random-user.png",
      followers: user.followers || [],
      following: user.following || [],
      likes: user.likes || [],
      googleId: user.googleId || null,
      authProvider: user.googleId ? 'google' : 'local',
      createdAt: user.createdAt
    }));

    res.status(200).json(normalizedUsers);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération des utilisateurs",
      error: error.message 
    });
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "ID utilisateur invalide" 
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur introuvable" 
      });
    }


    const userResponse = {
      _id: user._id,
      pseudo: user.pseudo || user.name,
      email: user.email,
      bio: user.bio || "",
      picture: user.picture || "./uploads/profil/random-user.png",
      followers: user.followers || [],
      following: user.following || [],
      likes: user.likes || [],
      googleId: user.googleId || null,
      authProvider: user.googleId ? 'google' : 'local',
      createdAt: user.createdAt
    };

    res.status(200).json(userResponse);

  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération de l'utilisateur",
      error: error.message 
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "ID utilisateur invalide" 
      });
    }


    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        message: "Vous ne pouvez modifier que vos propres données" 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur introuvable" 
      });
    }


    const userResponse = {
      _id: user._id,
      pseudo: user.pseudo || user.name,
      email: user.email,
      bio: user.bio || "",
      picture: user.picture || "./uploads/profil/random-user.png",
      followers: user.followers || [],
      following: user.following || [],
      likes: user.likes || [],
      googleId: user.googleId || null,
      authProvider: user.googleId ? 'google' : 'local'
    };

    console.log("Utilisateur mis à jour:", {
      id: userResponse._id,
      pseudo: userResponse.pseudo
    });

    res.status(200).json(userResponse);

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la mise à jour",
      error: error.message 
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "ID utilisateur invalide" 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur introuvable" 
      });
    }

    res.status(200).json({ 
      message: "Utilisateur supprimé avec succès" 
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la suppression",
      error: error.message 
    });
  }
};

module.exports.follow = async (req, res) => {
  try {
    const followerId = req.user._id;
    const { idToFollow } = req.body;

    if (!idToFollow || !idToFollow.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "ID à suivre invalide" 
      });
    }

    if (followerId.toString() === idToFollow) {
      return res.status(400).json({ 
        message: "Vous ne pouvez pas vous suivre vous-même" 
      });
    }


    await User.findByIdAndUpdate(
      followerId,
      { $addToSet: { following: idToFollow } },
      { new: true, upsert: true }
    );


    await User.findByIdAndUpdate(
      idToFollow,
      { $addToSet: { followers: followerId } },
      { new: true, upsert: true }
    );

    console.log(`Utilisateur ${followerId} suit maintenant ${idToFollow}`);

    res.status(200).json({ 
      message: "Suivi ajouté avec succès",
      followerId,
      idToFollow 
    });

  } catch (error) {
    console.error("Erreur lors du suivi:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors du suivi",
      error: error.message 
    });
  }
};

module.exports.unfollow = async (req, res) => {
  try {
    const followerId = req.user._id;
    const { idToUnfollow } = req.body;

    if (!idToUnfollow || !idToUnfollow.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "ID à ne plus suivre invalide" 
      });
    }


    await User.findByIdAndUpdate(
      followerId,
      { $pull: { following: idToUnfollow } },
      { new: true }
    );


    await User.findByIdAndUpdate(
      idToUnfollow,
      { $pull: { followers: followerId } },
      { new: true }
    );

    console.log(`Utilisateur ${followerId} ne suit plus ${idToUnfollow}`);

    res.status(200).json({ 
      message: "Suivi retiré avec succès",
      followerId,
      idToUnfollow 
    });

  } catch (error) {
    console.error("Erreur lors de l'arrêt du suivi:", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de l'arrêt du suivi",
      error: error.message 
    });
  }
};