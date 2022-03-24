import Router from 'koa-joi-router';

import { insertTransfer, deleteTransfer, checkTransfer } from '../controllers/transfer';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = Router();

router.prefix('/transfer');
//endTransafer.txt
router.post('/insert', authMiddleware, deviceMiddleware, insertTransfer);
router.get('/check', authMiddleware, deviceMiddleware, checkTransfer);
router.delete('/delete', authMiddleware, deviceMiddleware, deleteTransfer);

export default router;
