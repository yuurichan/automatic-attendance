// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)

import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import routers from "./routers";
//import { connectDB } from "./config/dbConn";
const PORT = process.env.PORT || 5000;

// Connect to mongoDB
//connectDB();
import "./config/Database"

// middlewares
// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// cors
app.use(cors());

// middleware for output colors
app.use(morgan("dev"));

// Routers
app.use("/api", routers.authRouter);
app.use("/api", routers.userRouter);
app.use("/api", routers.courseRouter);
app.use("/api", routers.studentRouter);
app.use("/api", routers.lessonRouter);
app.use("/api", routers.rollCallSession);
app.use("/api", routers.attendanceDetail);
app.use("/api", routers.faceRouter);

// select all; returns 404.html if it can't find anything from the above mentioned
// technically this would return a succeess 200
// app.use('/') đa phần dùng cho middleware, ko chấp nhận regex
// app.all('*') nhận regex và áp dụng cho mọi http methods (get, post, put, delete), dùng cho routing
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));    // so we change 200 to 404
    }
    else if (req.accepts('json')) {
        res.json({error: "404 Not Found"});    // so we change 200 to 404
    }
    else {
        res.type('txt').send("404 Not Found");
    }
})
// Mọi thứ nếu đi tới được mức này thì chỉ có return lỗi

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // IS always put at the end of server.js file
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
// App.listen for requests is only going to work ONLY IF we've successfully connected to
// the database

//console.log('test');