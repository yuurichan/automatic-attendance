import mongoose from "mongoose";
const URL = process.env.DATABASE_URI;

export const connectDB = async () => {
    await mongoose.connect(`${URL}`, err => {
        if (err)
            throw err;
    });
}
