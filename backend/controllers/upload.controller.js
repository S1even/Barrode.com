const UserModel = require('../models/user.model');
const { uploadErrors } = require('../utils/errors.utils');

module.exports.profilUpload = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        if (
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/png" &&
            req.file.mimetype !== "image/jpeg"
        ) {
            throw new Error("Invalid file type");
        }

        if (req.file.size > 500000) {
            throw new Error("File size exceeds the maximum allowed size of 500KB");
        }

        const imageBuffer = req.file.buffer;
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        // Update User Image
        const userId = req.body.userId;
        
        const userPicture = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { picture: base64Image } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!userPicture) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json({ 
            message: "Profile picture updated successfully", 
            user: userPicture 
        });

    } catch (err) {
        console.error("Error uploading profile picture:", err);
        const errors = uploadErrors(err);
        return res.status(400).json({ errors });
    }
};