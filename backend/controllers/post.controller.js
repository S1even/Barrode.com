const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require("mongoose").Types.ObjectId;
const { uploadErrors } = require('../utils/errors.utils');

const calculateDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Rayon de la Terre en mètres
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // en mètres
};

module.exports.createPost = async (req, res) => {
    let imageData = "";
    
    const posterId = req.user._id || req.user;
    const posterIdStr = posterId.toString();
    
    console.log("ID utilisateur authentifié:", posterIdStr);

    try {
        if (!posterId) {
            throw new Error("Utilisateur non authentifié");
        }
        if (req.file) {
            if (!req.file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
                throw new Error("invalid file");
            }

            if (req.file.size > 10000000) {
                throw new Error("max size");
            }

            const imageBuffer = req.file.buffer;
            imageData = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
        }

        const pathData = JSON.parse(req.body.path || "[]");
        let totalDistance = 0;

        if (pathData.length >= 2) {
            for (let i = 1; i < pathData.length; i++) {
                totalDistance += calculateDistance(pathData[i - 1], pathData[i]);
            }
        }
        const post = new PostModel({
            posterId: posterIdStr,
            message: req.body.message,
            picture: imageData,
            video: req.body.video,
            likers: [],
            comments: [],
            path: pathData,
            totalDistance
        });

        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Erreur lors de la création du post:", err);
        const errors = uploadErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.readPost = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("posterId", "pseudo picture");
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const updateData = { message: req.body.message };
        
        if (req.file) {
            if (!req.file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
                throw new Error("invalid file");
            }

            if (req.file.size > 10000000) {
                throw new Error("max size");
            }

            // Conversion de l'image en base64
            const imageBuffer = req.file.buffer;
            updateData.picture = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
        }

        const postUpdate = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true },
        );
        
        res.status(200).json(postUpdate);
    } catch (err) {
        console.log("Update error: " + err);
        const errors = uploadErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const postDelete = await PostModel.findByIdAndDelete(req.params.id);
        if (!postDelete)
            return res.status(400).send({ message: "Post not found." });
        res.status(200).json({ message: "Successfully deleted." });
    } catch (err) {
        console.log("Delete error: " + err);
        res.status(500).json({ message: "Erreur lors de la suppression du post" });
    }
};

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        // Normaliser les IDs pour s'assurer qu'ils sont stockés comme strings
        const postId = req.params.id.toString();
        const userId = req.body.id.toString();

        const postLike = await PostModel.findByIdAndUpdate(
            postId,
            { $addToSet: { likers: userId } },
            { new: true },
        );
        if (!postLike) return res.status(404).send('Post not found');

        const userLiker = await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { likes: postId } },
            { new: true },
        );
        if (!userLiker) return res.status(404).send('User not found');

        res.status(200).json({ postLike, userLiker });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const postLike = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { likers: req.body.id } },
            { new: true },
        );
        if (!postLike) return res.status(404).send('Post not found');

        const userLiker = await UserModel.findByIdAndUpdate(
            req.body.id,
            { $pull: { likes: req.params.id } },
            { new: true },
        );
        if (!userLiker) return res.status(404).send('User not found');

        res.status(200).json({ postLike, userLiker });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const postComment = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
        );
        if (!postComment) return res.status(404).send('Post not found');
        res.status(200).json(postComment);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const commentEdit = await PostModel.findById(req.params.id);
        if (!commentEdit) return res.status(404).send('Post not found');

        const theComment = commentEdit.comments.find((comment) =>
            comment._id.equals(req.body.commentid)
        );
        if (!theComment) return res.status(404).send('Comment not found');

        theComment.text = req.body.text;
        await commentEdit.save();

        res.status(200).json(commentEdit);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown: ' + req.params.id);

    try {
        const commentDelete = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: { _id: req.body.commentid },
                },
            },
            { new: true },
        );
        if (!commentDelete) return res.status(404).send('Post not found');
        res.status(200).json(commentDelete);
    } catch (err) {
        return res.status(400).send(err);
    }
};