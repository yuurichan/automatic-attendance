import mongoose from 'mongoose'
import { ICourse } from '../config/interface'

const CourseScheme = new mongoose.Schema({
    // Ten mon hoc
    name: {
        type: String,
        default: "",
        required: true,
        minlength: [5, "Tên môn học có ít nhất 5 ký tự"],
        maxlength: [200, "Tên môn học dài nhất 200 ký tự"],
        trim: true
    },
    // Giao vien chu nhiem
    teacher: { type: mongoose.Types.ObjectId, ref: 'user' },
    // Hoc ki gom: 1, 2, 3,...
    semester: {
        type: String,
    },
    // Ngay bat dau
    yearStart: {
        type: String
    },
    // Ngay ket thuc
    yearEnd: {
        type: String
    },
    // So tin chi
    credit: {
        type: Number,
        require: true
    },
    // Ma hoc phan
    courseCode: {
        type: String,
        default: '',
    },
    students: [
        {
            ref: "student",
            type: mongoose.Types.ObjectId
        }
    ],
    // Mo ta mon hoc
    description: {
        type: String,
        default: '',
        maxlength: [500, "Mô tả môn học dài nhất 500 ký tự"],
        trim: true
    }
}, {
    timestamps: true
})

export default mongoose.model<ICourse>('course', CourseScheme)