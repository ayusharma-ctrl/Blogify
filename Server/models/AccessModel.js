import mongoose from "mongoose";

const schema = new mongoose.Schema({
    sessionId: {
        type: String,
        require: true,
    },
    time: {
        type: Date,
        default: Date.now()
    },
})

export const accessModel = mongoose.model("access", schema)