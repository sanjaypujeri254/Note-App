import express from 'express';
import { createNote, getNotes, deleteNote, updateNote } from '../controllers/noteController.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();
router.use(authenticateToken);
router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
export default router;
//# sourceMappingURL=noteRoutes.js.map