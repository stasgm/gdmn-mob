import router from 'koa-joi-router';

import { newMessage, getMessages, removeMessage, clear } from '../controllers/message';
import { authMiddleware, deviceMiddleware, messageMiddleware } from '../middleware';
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
