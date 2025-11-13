import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
const router = express.Router();

router.post('/', login);
router.get('/verify-token', verifyToken)

export default router;