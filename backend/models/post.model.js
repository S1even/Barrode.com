const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        picture: {
            type: String,
        },
        author: {
            type: String,
            required: false,
            trim: true,
        },
        likers: {
            type: [String],
            default: [],
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            required: true,
        },
        path: {
            type: [[Number]],
            default: [],
            validate: {
                validator: function (value) {
                    return value.every(coord => coord.length === 2);
                },
                message: "Chaque point du tracé doit contenir [latitude, longitude].",
            },
        },
        totalDistance: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);