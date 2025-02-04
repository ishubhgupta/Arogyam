import express from 'express';
import { getpatientDetails, updatepatientDetails } from '../controllers/patientController.js';
import { verifyToken } from "../middlewares/authentication.js";

const router = express.Router();

router.get('/profile', verifyToken, getpatientDetails);

router.put('/profile', verifyToken, updatepatientDetails);

export default router;
