import mongoose from "mongoose";

const schema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true 
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    },
    isEdited: {
        type: Boolean,
        default: false 
    }
})

export const commentModel = mongoose.model("comment",schema)