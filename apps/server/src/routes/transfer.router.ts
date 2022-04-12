import Router from 'koa-joi-router';

import { setTransfer, deleteTransfer, getTransfer } from '../controllers/transfer';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = Router();

router.prefix('/transfer');
router.post('/', authMiddleware, deviceMiddleware, setTransfer);
router.get('/', authMiddleware, deviceMiddleware, getTransfer);
router.delete('/', authMiddleware, deviceMiddleware, deleteTransfer);

export default router;
