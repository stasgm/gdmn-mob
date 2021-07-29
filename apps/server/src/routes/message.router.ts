import Router from 'koa-joi-router';

import { newMessage, getMessage, removeMessage, subscribe, publish, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageValidation } from '../validations';

const router = Router();

router.prefix('/messages');
router.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, newMessage);
router.get('/:companyId/:appSystem', messageValidation.getMessage, authMiddleware, deviceMiddleware, getMessage);
router.delete('/:id', messageValidation.removeMessage, authMiddleware, deviceMiddleware, removeMessage);
router.delete('/', authMiddleware, deviceMiddleware, clear);
router.get('/subscribe/:companyId/:appSystem', authMiddleware, deviceMiddleware, subscribe);
router.post('/publish/:companyId', messageValidation.publish, authMiddleware, deviceMiddleware, publish);

export default router;
