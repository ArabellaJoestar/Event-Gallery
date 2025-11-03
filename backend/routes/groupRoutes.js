import express from 'express';
import * as GroupController from '../controllers/groupController.js';
import { authenticate } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', authenticate, GroupController.createGroup);
router.get('/', GroupController.getAllGroups);
router.get('/:id', GroupController.getGroupById);
router.put('/:id', authenticate, GroupController.updateGroup);
router.delete('/:id', authenticate, GroupController.deleteGroup);

export default router;