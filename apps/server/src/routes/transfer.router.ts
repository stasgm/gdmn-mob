import Router from 'koa-joi-router';

import { setTransfer, deleteTransfer, getTransfer } from '../controllers/transfer';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { transferValidation } from '../validations';

const router = Router();

router.prefix('/transfer');
//endTransafer
router.post('/insert', authMiddleware, deviceMiddleware, setTransfer);
router.get('/check', authMiddleware, deviceMiddleware, getTransfer);
router.delete('/delete/:uid', transferValidation.deleteValid, authMiddleware, deviceMiddleware, deleteTransfer);

export default router;
