
import express from 'express'
import { saveLabledFaceDescriptors, saveLabledFaceDescriptors_guest, getDescriptors } from '../controllers/faceControllers'

import { auth } from '../middlewares/auth'

const router = express.Router();
router.post('/face_api', auth, saveLabledFaceDescriptors);
router.post('/face_api_guest', saveLabledFaceDescriptors_guest);
router.post('/face_api_descriptors', auth, getDescriptors);


export default router;