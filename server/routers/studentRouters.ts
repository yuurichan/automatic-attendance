import express from 'express'

const router = express.Router()
import { auth } from '../middlewares/auth'
import StudentController from '../controllers/studentControllers'

router.put('/student/:id', auth, StudentController.updateStudent)
router.delete('/student/:id', auth, StudentController.delteStudent)

export default router