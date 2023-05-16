import mongoose from "mongoose";
import clc from "cli-color";

// database connection
export const mongoDbConnection = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(clc.blueBright.bold("Database is connected."))
    })
    .catch((error)=>{
        console.log(clc.red(error))
    })
}