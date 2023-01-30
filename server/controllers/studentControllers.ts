import mongoose from 'mongoose'
import { Request, Response } from 'express'
import Students from '../models/studentModel'
import AttendanceDetail from '../models/attendanceDetailModel'

class StudentControlles {
    async updateStudent(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, studentCode, gender, phone } = req.body

            let student = await Students.findById(id)
            if (!student)
                return res.status(500).json({ msg: "Không tìm thấy học sinh" })

            await Students.findByIdAndUpdate(id, {
                name, studentCode, gender, phone
            }, { new: true })

            res.json({
                msg: 'Cập nhật sinh viên thành công',
                newStudent: student
            })
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    async delteStudent(req: Request, res: Response) {
        try {
            const { id } = req.params


            let student = await Students.findById(id)
            if (!student)
                return res.status(500).json({ msg: "Không tìm thấy học sinh" })


            await Students.findByIdAndDelete(id)

            await AttendanceDetail.deleteMany({
                student: student._id
            })

            res.json({
                msg: 'Xóa sinh viên thành công',
                student: student
            })
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }
}

export default new StudentControlles()