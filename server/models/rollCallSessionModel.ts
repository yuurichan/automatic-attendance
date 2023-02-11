import mongoose from 'mongoose'

const RollCallSessionScheme = new mongoose.Schema({
    // Chi tiet diem danh
    attendanceDetails: [
        {
            ref: "attendaceDetail",
            type: mongoose.Types.ObjectId
        },
    ],
    // Buoi hoc
    lesson: {
        ref: "lesson",
        type: mongoose.Types.ObjectId
    },
    // Giao vien diem danh
    teacher: {
        ref: "user",
        type: mongoose.Types.ObjectId
    },
    // Nhan xet ve buoi hoc
    comment: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Tên nhận xét dài nhất 500 ký tự"],
    },
    end: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: Date().toString()
    }
}, {
    timestamps: true
})

export default mongoose.model('rollCallSession', RollCallSessionScheme)