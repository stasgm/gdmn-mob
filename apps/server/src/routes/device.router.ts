import Router from 'koa-joi-router';

import { addDevice, getDevices, updateDevice, removeDevice, getDevice } from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';

import { deviceValidation } from '../validations';

const router = Router();

router.prefix('/devices');
router.post('/', deviceValidation.addDevice, authMiddleware, permissionMiddleware, addDevice);
router.get('/', authMiddleware, deviceMiddleware, getDevices);
router.get('/:id', deviceValidation.getDevice, deviceMiddleware, getDevice);
//TODO - без доп проверки даёт возможность получить доступ по любому  устройству
// router.get('/:id/user/:name', getDeviceByUser);
// router.get('/:id/user/', getDeviceByUser);
// router.get('/:id/currentuser', compose([deviceMiddleware, authMiddleware]), getDeviceByCurrentUser);
//getUsersByDevice - поиск пользователей по таблице устройств
// router.get('/:id/users', deviceValidation.getUsersByDevice, deviceMiddleware, authMiddleware, getUsersByDevice);
router.patch('/:id', deviceValidation.updateDevice, authMiddleware, permissionMiddleware, updateDevice);
router.delete('/:id', deviceValidation.removeDevice, authMiddleware, permissionMiddleware, removeDevice);

export default router;
