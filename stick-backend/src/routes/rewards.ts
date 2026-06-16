import { Router } from 'express';
import { checkAuth } from '../middleware/auth';
import { rewardController } from '../controllers/rewardController';

const router = Router();

router.get('/', checkAuth, rewardController.getRewards);
router.post('/', checkAuth, rewardController.createReward);
// Маршрут для покупки! Обрати внимание, метод POST (мы совершаем действие)
router.post('/:id/claim', checkAuth, rewardController.claimReward);
router.delete('/:id', checkAuth, rewardController.deleteReward);

export default router;