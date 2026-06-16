import { Router } from 'express';
import { checkAuth } from '../middleware/auth';
import { taskController } from '../controllers/taskController';

const router = Router();

// Маршруты для задач (префикс /api/tasks зададим в index.ts)
router.get('/', checkAuth, taskController.getTasks);
router.post('/', checkAuth, taskController.createTask);
router.delete('/:id', checkAuth, taskController.deleteTask);
router.patch('/:id/complete', checkAuth, taskController.completeTask);

export default router;