import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    }
})

export const likeModel = mongoose.model("like", schema)