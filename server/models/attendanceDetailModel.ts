import mongoose from 'mongoose'

const AttendanceDetailScheme = new mongoose.Schema({
    student: {
        type: mongoose.Types.ObjectId,
        ref: 'student'
    },
    note: {
        type: String,
        trim: true,
        default: ""
    },
    date: {
        type: String,
        default: new Date().toString()
    },
    absent: {
        type: Boolean,
        default: true
    },
    isAttendance: {
        type: Boolean,
        default: false
    },
    rollCallSession: {
        type: mongoose.Types.ObjectId,
        ref: 'rollCallSession'
    }
}, {
    timestamps: true
})

export default mongoose.model('attendaceDetail', AttendanceDetailScheme)