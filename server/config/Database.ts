import mongoose from "mongoose";

const URL = process.env.DATABASE_URI


mongoose.connect(`${URL}`, err => {
    if (err) throw err;
    console.log("Mongodb connection")
})