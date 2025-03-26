const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
}

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
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknow : " + req.params.id)

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