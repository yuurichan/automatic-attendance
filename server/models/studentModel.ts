import mongoose from 'mongoose'
import { IStudent } from '../config/interface'

const StudentScheme = new mongoose.Schema({
    // Ho ten sinh vien
    name: {
        type: String,
        trim: true,
        maxlength: 50
    },
    // Ma so sinh vien
    studentCode: {
        type: String,
        trim: true,
        maxlength: 50,
        // unique: true, // Duy nhat
    },
    // Gioi tinh
    gender: {
        type: String,
        default: "male", // 1: male, 2:female
    },
    phone: {
        type: String
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "course"
    },
    avatar: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

export default mongoose.model<IStudent>('student', StudentScheme)