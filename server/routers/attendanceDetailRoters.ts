import express from 'express'

const router = express.Router();
import { auth } from '../middlewares/auth'
import AttentdanceControllers from '../controllers/attendanceDetailControllers'

router.put('/attendance_detail/:id', auth, AttentdanceControllers.updateAttendanceDetail)

export default router;