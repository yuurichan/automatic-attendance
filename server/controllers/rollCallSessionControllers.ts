import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { RequestUser } from '../config/interface'
import RollCallSessionModel from '../models/rollCallSessionModel';
import AttendanceDetailModel from '../models/attendanceDetailModel';

class RollCallSessionControllers {
    async createRollCallSession(req: RequestUser, res: Response) {
        try {
            const { lesson, comment, newDate } = req.body;

            const studentsArrayObject = lesson.course.students.map((student: any) => {
                return {
                    //date: new Date().toString(),
                    date: newDate,
                    note: "",
                    student: student._id
                }
            })

            const newAttendanceDetail = await AttendanceDetailModel.insertMany(studentsArrayObject)

            const newAttendanceDetailId = newAttendanceDetail.map(attendanceDetail => attendanceDetail._id);

            let newRollCallSession = new RollCallSessionModel({
                lesson,
                comment,
                createdAt: newDate,
                course: lesson.course,
                teacher: req.user,
                attendanceDetails: newAttendanceDetailId
            })

            newRollCallSession = await newRollCallSession.save();

            // // Cap nhat lai chi tiet diem danh
            await AttendanceDetailModel.updateMany(
                { _id: { $in: newAttendanceDetailId } }, {
                $set: {
                    rollCallSession: new mongoose.Types.ObjectId(newRollCallSession._id)
                }
            })

            return res.json({
                msg: "Tạo buổi điểm danh thành công",
                newRollCallSession: newRollCallSession._doc
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async getRollCallSessionDetail(req: RequestUser, res: Response) {
        try {
            const { id } = req.params;

            const rollCallSession = await RollCallSessionModel.findById(id)
                .populate(
                    {
                        path: 'attendanceDetails',
                        populate: [
                            {
                                path: "student"
                            }
                        ]
                    }
                )
                .populate({
                    path: 'lesson',
                    populate: {
                        path: 'course',
                    }
                })
                .populate("teacher", '-password')

            return res.json({ rollCallSession })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async getRollCallSessionUser(req: RequestUser, res: Response) {
        try {

            const { id } = req.params;

            const rollCallSessions = await RollCallSessionModel.find({ teacher: new mongoose.Types.ObjectId(id) })
                .populate({
                    path: 'attendanceDetails',
                    populate: [
                        {
                            path: "student"
                        }
                    ]
                })
                .populate({
                    path: 'lesson',
                    populate: {
                        path: 'course',
                    }
                })
                .populate("teacher", '-password').sort('-createdAt')

            return res.json({ rollCallSessions })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async updateRollCallSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { end, attendanceDetails, lesson, teacher, comment } = req.body;

            const rollCallSession = await RollCallSessionModel.findByIdAndUpdate(id, {
                end, attendanceDetails, lesson, teacher, comment
            }).populate(
                {
                    path: 'attendanceDetails',
                    populate: [
                        {
                            path: "student"
                        }
                    ]
                }
            )
                .populate({
                    path: 'lesson',
                    populate: {
                        path: 'course',
                    }
                })
                .populate("teacher", '-password')

            return res.json({ msg: "Chỉnh sửa thành công", rollCallSession: rollCallSession._doc });
        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

export default new RollCallSessionControllers();