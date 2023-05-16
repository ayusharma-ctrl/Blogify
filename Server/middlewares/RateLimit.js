// file-imports
import { accessModel } from "../models/AccessModel.js"

// func to implement Rate Limiting or to restrict the access for a scheduled time
export const RateLimiting = async (req, res, next) => {
    const sessionId = req.session.user.userId;
    //check if the person is making the request for the first time
    const accessDb = await accessModel.findOne({ sessionId: sessionId });
    if (!accessDb) {
        //create a new entry in access collection
        const accessObj = await accessModel.create({
            sessionId: sessionId,
        });
        next();
    }
    // if accessDb was there, then compare the time //console.log(accessDb.time); console.log(Date.now());
    const diff = (Date.now() - accessDb.time) / 1000;
    if (diff < 1) {
        return res.status(400).json({
            success: false,
            message: "Too many request, please wait for some time",
        });
    }
    // if diff is greater than 1 sec
    try {
        await accessModel.findOneAndUpdate({ sessionId }, { time: Date.now() });
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}