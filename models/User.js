const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        surname: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        profilePicture: {
            type: String,
            default: "avatar-default.png",

        },
        coverPicture: {
            type: String,
            default: "image-2.jpg"

        },
        description: {
            type: String,
            default: "Hello! Im new here :)",
            maxLength: 50
        },
        city: {
            type: String,
            maxLength:40,
            default: ''
        },
        age: {
            type: String,
            maxLength:40,
            default: ''
        },
        university: {
            type: String,
            maxLength:40,
            default: ''
        },
        followers: {
            type: Array,
            default: []
        },
        following: {
            type: Array,
            default: []

        },
        isAdmin: {
            type: Boolean,
            default: false,
        }

    },
    {timestamps: true})

module.exports = mongoose.model("User", UserSchema);