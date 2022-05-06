import Router from 'koa-joi-router';

import { newMessage, getMessage, removeMessage, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageParamsMiddlware } from '../middleware/messageParams';
import { messageValidation } from '../validations';

const router = Router();

router.prefix('/messages');
router.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, messageParamsMiddlware, newMessage);
router.get('/:companyId/:appSystemId', messageValidation.getMessage, authMiddleware, deviceMiddleware, getMessage);
router.delete('/:id', messageValidation.removeMessage, authMiddleware, deviceMiddleware, removeMessage);
router.delete('/', messageValidation.clear, authMiddleware, deviceMiddleware, clear);

export default router;
