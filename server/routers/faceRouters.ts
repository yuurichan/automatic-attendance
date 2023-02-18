
import express from 'express'
import { saveLabledFaceDescriptors, saveLabledFaceDescriptors_guest, getDescriptors_DB, getDescriptors_guest, saveLabledFaceDescriptors_DB, saveLabledFaceDescriptors_DB_guest } from '../controllers/faceControllers'

import { auth } from '../middlewares/auth'

const router = express.Router();
router.post('/face_api', auth, saveLabledFaceDescriptors_DB);
router.post('/face_api_guest', saveLabledFaceDescriptors_DB_guest);
router.post('/face_api_descriptors', auth, getDescriptors_DB);
router.get('/face_api_descriptors_guest', getDescriptors_guest);


export default router;