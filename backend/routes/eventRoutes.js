import express from 'express';
import * as EventController from '../controllers/eventController.js';
import { authenticate } from '../middlewares/auth.js';
import upload from '../config/multer.js';
const router = express.Router();

// Upload de evento
const eventUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 10 }
]);

router.post('/', authenticate, eventUpload, EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.put('/:id', authenticate, eventUpload, EventController.updateEvent);
router.delete('/:id', authenticate, EventController.deleteEvent);

export default router;