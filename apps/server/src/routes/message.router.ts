import router from 'koa-joi-router';

import { newMessage, getMessages, removeMessage, clear } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { messageValidation } from '../validations';

const messages = router();

messages.prefix('/messages');
messages.post('/', messageValidation.newMessage, authMiddleware, deviceMiddleware, newMessage);
messages.get(
  '/',
  // messageValidation.getMessages,
  authMiddleware,
  deviceMiddleware,
  getMessages,
);
messages.delete('/:id', messageValidation.removeMessage, authMiddleware, deviceMiddleware, removeMessage);
messages.delete('/', messageValidation.clear, authMiddleware, deviceMiddleware, clear);

export default messages;
