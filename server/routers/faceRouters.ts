
import express from 'express'
import { saveLabledFaceDescriptors, getDescriptors } from '../controllers/faceControllers'

import { auth } from '../middlewares/auth'

const router = express.Router();
router.post('/face_api', auth, saveLabledFaceDescriptors);
router.post('/face_api_descriptors', auth, getDescriptors);


export default router;