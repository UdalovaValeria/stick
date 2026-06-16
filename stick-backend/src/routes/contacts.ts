import { Router } from 'express';
import { checkAuth } from '../middleware/auth';
import { contactController } from '../controllers/contactController';

const router = Router();

router.get('/', checkAuth, contactController.getContacts);
router.post('/', checkAuth, contactController.createContact);
router.patch('/:id/touch', checkAuth, contactController.touchContact);

export default router;