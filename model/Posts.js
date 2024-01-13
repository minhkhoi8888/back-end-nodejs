const mongoose = require("mongoose");

const PostsScheme = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            reg: "User"
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
        },
        spelling: {
            type: String,
            required: true,
        },
        image: {
            type: string,

        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Posts", PostsScheme);