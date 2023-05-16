import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    emailAuthenticated: {
        type: Boolean,
        require: true,
        default: false,
    },
    passwordModify: {
        type: Boolean,
        require: true,
        default: false,
    },
    blogsPosted: {
        type: Number,
        default: 0
    },
    blogsDeleted: {
        type: Number,
        default: 0
    }
})

export const userModel = mongoose.model("user", schema)