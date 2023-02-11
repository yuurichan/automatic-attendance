import express from 'express'

import { auth } from '../middlewares/auth'
import CourseControllers from '../controllers/courseControllers';

const router = express.Router();
router.post('/create_course', auth, CourseControllers.createCourse);
router.get('/get_courses', auth, CourseControllers.getCourses);
router.get('/get_courses_student_guest', CourseControllers.getCourses_guest);
router.delete('/course/:id', auth, CourseControllers.deleteCourse);
router.get('/course/:id', CourseControllers.getcourseDetail);
router.post('/add_studens/:id', auth, CourseControllers.addManyStudents);
router.post('/add_student/:id', auth, CourseControllers.addOneStudent);
router.put('/update_course/:id', auth, CourseControllers.updateCourse);
router.get('/user_course/:id', auth, CourseControllers.getUserCourse);
export default router;