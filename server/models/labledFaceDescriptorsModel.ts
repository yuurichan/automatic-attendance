import mongoose from 'mongoose'
import { ILabledFaceDescriptor } from '../config/interface'

const LabledFaceDescriptorScheme = new mongoose.Schema({
    // Ma so sinh vien
    label: {
        type: String,
        trim: true
    },
    descriptors: [[Number]]
}, {
    timestamps: true
})

export default mongoose.model<ILabledFaceDescriptor>('labeldFaceDescriptors', LabledFaceDescriptorScheme)