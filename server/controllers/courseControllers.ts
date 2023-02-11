import mongoose from 'mongoose'
import { Request, Response } from 'express'
import Course from "../models/courseModel";
import Users from '../models/userModel';
import Students from '../models/studentModel';
import { RequestUser } from '../config/interface'
import Lessons from '../models/lessonModel'

class APIfeatures {

    query: any
    queryString: any

    constructor(query: any, queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 4
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this.query
    }
}

class CourseController {
    async createCourse(req: RequestUser, res: Response) {
        try {
            const { name, credit, yearStart, yearEnd, courseCode, semester, description, students } = req.body;


            // Tao mon hoc moi
            const newCourse = new Course({
                name, semester, credit, yearStart, yearEnd, courseCode, description,
                teacher: req.user?._id
            })

            // Luu vao data base
            await newCourse.save();

            const studentsArrayObject = students.map((student: any) => {
                return {
                    name: student.name,
                    studentCode: student.studentCode,
                    gender: student.gender,
                    course: newCourse._id,
                    avatar: student.gender === 'male' ? "https://res.cloudinary.com/dxnfxl89q/image/upload/v1648222975/nienluannganh/student-male-avatar_oywxdt.png" : "https://res.cloudinary.com/dxnfxl89q/image/upload/v1648222975/nienluannganh/student-female-avatar_zyezln.png"
                }
            })

            const studentArray = await Students.insertMany(studentsArrayObject);

            await Course.findByIdAndUpdate(newCourse._id, {
                students: studentArray.map(student => student._id)
            }, { new: true });


            // Them mon hoc vao model cua user
            await Users.findOneAndUpdate({ _id: req.user?._id },
                {
                    $push:
                        { courses: newCourse._id }
                }, {
                new: true
            })

            return res.json({
                msg: "Tạo khoá học thành công", newCourse: {
                    teacher: req.user,
                    ...newCourse._doc
                }
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async getCourses(req: Request, res: Response) {
        try {
            const courses = await Course.find({}).sort("-createdAt")
                .populate("teacher").populate("students")

            return res.json({ courses, length: courses.length })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    // Only allows guests to grab the id list of the courses
    // does not include other infos like teachers, students, course names, etc.
    async getCourses_guest(req: Request, res: Response) {
        try {
            const courses = await Course.find({}, {projection: {_id: 1}}).sort("-createdAt")

            return res.json({ courses })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async getcourseDetail(req: RequestUser, res: Response) {
        try {
            const { id } = req.params;
            const course = await Course.findById(id).populate("teacher", ["name", "email", "avatar", "role", 'account']).populate("students")
            if (!course) return res.status(404).json({ msg: "Không tìm thấy khoá học" })

            return res.json({ course })

        } catch (error: any) {
            if (error.valueType === "string")
                return res.status(500).json({ msg: "ID buổi học không hợp lệ" })
            return res.status(500).json({ msg: error.message })
        }
    }

    async deleteCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;

            let course = await Course.findById(id);
            if (!course) return res.status(404).json({ msg: "Không tìm thấy môn học" })

            const lesson = await Lessons.find({ course: course._id })
            if (lesson.length !== 0) {
                return res.status(400).json({ msg: "Hãy xoá các buổi học liên quan!" })
            }

            const arrayId = course.students.map((student: any) => {
                return `${new mongoose.Types.ObjectId(student._id)}`
            })

            // Xoa cac sinh vien co trong lop hoc
            await Students.deleteMany({
                _id: {
                    $in: arrayId
                }
            })

            await Course.findByIdAndDelete(id);

            return res.json({ msg: "Xoá môn học thành công" });

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async updateCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, credit, yearStart, yearEnd, courseCode, semester, description, students } = req.body;

            let course = await Course.findById(id);
            if (!course) return res.status(404).json({ msg: "Không tìm thấy môn học" })

            const studentsArrayObject = students.map((student: any) => {
                return {
                    name: student.name,
                    studentCode: student.studentCode,
                    gender: student.gender,
                    course: id,
                    avatar: student.gender === 'male' ? "https://res.cloudinary.com/dxnfxl89q/image/upload/v1648222975/nienluannganh/student-male-avatar_oywxdt.png" : "https://res.cloudinary.com/dxnfxl89q/image/upload/v1648222975/nienluannganh/student-female-avatar_zyezln.png"
                }
            })

            const studentArray = await Students.insertMany(studentsArrayObject);

            course = await Course.findByIdAndUpdate(id, {
                name, semester, credit, yearStart, yearEnd, courseCode, description, students: course.students.concat(studentArray.map(student => student._id))
            }, { new: true }).populate(['students']);


            return res.json({ msg: "Cập nhật môn học thành công", course: { ...course?._doc }, studentArray })

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ msg: error.message })
        }
    }

    async getUserCourse(req: RequestUser, res: Response) {
        try {
            const { id } = req.params;
            const queryString = req.query;
            const query = new APIfeatures(Course.find({ teacher: id }), queryString).paginating()
            const courses = await query.sort("-createdAt").populate("teacher")
            const length = await Course.find({ teacher: id }).countDocuments()
            return res.json({
                msg: "Lấy danh sách môn học thành công",
                courses,
                result: courses.length,
                total: length
            })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async addOneStudent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { student } = req.body;

            const course = await Course.findById(id);

            if (!course) {
                return res.status(404).json({ msg: "Không tìm thấy môn học" })
            }


            let newStudent = new Students({
                student
            })

            newStudent = await newStudent.save();

            await Course.findByIdAndUpdate(id, {
                students: course.students.push(newStudent)
            })

            return res.json({ msg: "Thêm sinh viên thành công", newStudent })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

    async addManyStudents(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { students } = req.body;

            const course = await Course.findById(id);

            if (!course) {
                return res.status(404).json({ msg: "Không tìm thấy môn học" })
            }

            const studentsArrayObject = students.map((student: any) => {
                return {
                    name: student.name,
                    studentCode: student.studentCode,
                }
            })

            const studentArray = await Students.insertMany(studentsArrayObject);

            await Course.findByIdAndUpdate(id, {
                students: course.students.concat(studentArray)
            })

            return res.json({ msg: "Thêm sinh viên thành công", studentArray })

        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }

}

export default new CourseController;