import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    startFollowing: {
        type: Date,
        default: Date.now()
    }
})

export const followerModel = mongoose.model('follower',schema)