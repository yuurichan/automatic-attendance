import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Lessons from '../models/lessonModel'
import RollCallSesson from '../models/rollCallSessionModel'
import { RequestUser } from '../config/interface'
import AttentdanceDetailModel from '../models/attendanceDetailModel'
import RollCallSessionModel from "../models/rollCallSessionModel"

class LessonController {

    async getLessonUser(req: RequestUser, res: Response) {
        try {
            const lessons = await Lessons.find({ teacher: req.user?._id }).sort('-createdAt')
                .populate({
                    path: 'course',
                    populate: {
                        path: 'students'
                    }
                })
                .populate("teacher", '-password')
            return res.json({
                lessons
            })
        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async createLesson(req: RequestUser, res: Response) {
        try {
            const { timeStart, timeEnd, desc, course_id, weekday } = req.body;

            const newLesson = new Lessons({
                timeStart, timeEnd, desc, course: course_id, weekday,
                teacher: req.user?._id
            })

            await newLesson.save();

            return res.json({
                msg: "Tạo buổi học thành công",
                newLesson: newLesson._doc
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async updateLesson(req: RequestUser, res: Response) {
        try {
            const { id } = req.params;
            const { timeStart, timeEnd, desc, course_id, weekday } = req.body;

            const newLesson = await Lessons.findByIdAndUpdate(id, {
                timeStart, timeEnd, desc, course: course_id, weekday
            })

            return res.json({
                msg: "Cập nhật thành công",
                newLesson: newLesson._doc
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async deleteLesson(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Xoa buoi hoc
            const lesson = await Lessons.findByIdAndDelete(id).populate('course');

            // Xoa cac buoi diem danh lien quan toi buoi hoc

            let rollCallSessions = await RollCallSessionModel.find({ lesson: lesson._id })

            await RollCallSessionModel.deleteMany({ lesson: lesson._id });

            // Xoa cac chi tiet diem danh
            await AttentdanceDetailModel.deleteMany({
                rollCallSession: {
                    $in: rollCallSessions.map((item) => item._id)
                }
            })

            return res.json({
                msg: "Xóa buổi học thành công"
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async getLesson(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const lesson = await Lessons.findById(id)
                .populate({
                    path: 'course',
                    populate: {
                        path: 'students'
                    }
                })
                .populate("teacher", '-password')

            const rollCallSessions = await RollCallSesson.find({
                lesson: new mongoose.Types.ObjectId(id)
            })
                .populate("lesson")
                .populate([
                    {
                        path: "attendanceDetails",
                        populate: {
                            path: 'student'
                        }
                    }
                ])



            return res.json({ lesson, rollCallSessions })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

export default new LessonController()