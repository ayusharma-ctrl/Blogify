import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    conclusion: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    hashtags: [],

    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

export const blogModel = mongoose.model("blog",schema)