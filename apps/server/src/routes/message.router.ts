import Router from 'koa-joi-router';

import { newMessage, getMessages, removeMessage, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageValidation } from '../validations';

const router = Router();

router.prefix('/messages');
router.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, newMessage);
router.get('/', messageValidation.getMessages, authMiddleware, deviceMiddleware, getMessages);
router.delete('/:id', messageValidation.removeMessage, authMiddleware, deviceMiddleware, removeMessage);
router.delete('/', messageValidation.clear, authMiddleware, deviceMiddleware, clear);

export default router;
