import router from 'koa-joi-router';

import { newMessage, getMessages, removeMessage, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageMiddleware } from '../middleware/messageRequired';
import { messageValidation } from '../validations';

const messages = router();

messages.prefix('/messages');
messages.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, newMessage);
messages.get('/', messageValidation.getMessages, authMiddleware, deviceMiddleware, messageMiddleware, getMessages);
messages.delete(
  '/:id',
  messageValidation.removeMessage,
  authMiddleware,
  deviceMiddleware,
  messageMiddleware,
  removeMessage,
);
messages.delete('/', messageValidation.clear, authMiddleware, deviceMiddleware, messageMiddleware, clear);

export default messages;
