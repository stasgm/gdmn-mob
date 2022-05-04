import router from 'koa-joi-router';

import { newMessage, getMessage, removeMessage, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageParamsMiddlware } from '../middleware/messageParams';
import { messageValidation } from '../validations';

const messages = router();

messages.prefix('/messages');
messages.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, messageParamsMiddlware, newMessage);
messages.get('/:companyId/:appSystem', messageValidation.getMessage, authMiddleware, deviceMiddleware, getMessage);
messages.delete('/:id', messageValidation.removeMessage, authMiddleware, deviceMiddleware, removeMessage);
messages.delete('/', authMiddleware, deviceMiddleware, clear);

export default messages;
