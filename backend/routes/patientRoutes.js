import express from 'express';
import { getGoogleFit, getPatientDetails, updatePatientDetails } from '../controllers/patientController.js';
import { verifyToken } from "../middlewares/authentication.js";

const router = express.Router();

router.get('/profile', verifyToken, getPatientDetails);

router.put('/profile', verifyToken, updatePatientDetails);

router.get('/googlefit', verifyToken, getGoogleFit);

export default router;
