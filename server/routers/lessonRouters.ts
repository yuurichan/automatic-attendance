import express from 'express'

const router = express.Router();
import { auth } from '../middlewares/auth'
import LessonController from '../controllers/LessonControllers'

router.post('/lesson', auth, LessonController.createLesson);
router.get('/lesson', auth, LessonController.getLessonUser);
router.get('/lesson/:id', auth, LessonController.getLesson);
router.put('/lesson/:id', auth, LessonController.updateLesson);
router.delete('/lesson/:id', auth, LessonController.deleteLesson);

export default router;