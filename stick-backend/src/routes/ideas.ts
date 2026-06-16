import { Router } from 'express';
import { checkAuth } from '../middleware/auth';
import { ideaController } from '../controllers/ideaController';

const router = Router();

router.get('/', checkAuth, ideaController.getIdeas);
router.post('/', checkAuth, ideaController.createIdea);
router.patch('/:id/status', checkAuth, ideaController.updateIdeaStatus);
router.delete('/:id', checkAuth, ideaController.deleteIdea);

export default router;