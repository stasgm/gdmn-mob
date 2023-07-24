const deviceStates = {
  'NON-REGISTERED': 'Не зарегистрировано',
  'NON-ACTIVATED': 'Не активно',
  ACTIVE: 'Активно',
  BLOCKED: 'Заблокировано',
};

const adminPath = '/admin';

const hostName = 'server.gdmn.app';

const validPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/);

export { deviceStates, adminPath, hostName, validPassword };
