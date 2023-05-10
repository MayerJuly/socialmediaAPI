const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            required: true
        },
        NameUser: {
            type:String,
            required: true
        },
        SurnameUser: {
            type:String,
            required: true
        },
        profilePicture: {
            type:String,
        },
        description: {
            type: String,
            max: 500
        },
        image: {
            type: String
        },
        likes: {
            type:Array,
            default: []
        }



    },
    {timestamps: true})

module.exports = mongoose.model("Post", PostSchema);