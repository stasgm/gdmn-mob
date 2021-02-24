import { initEnvironment } from './_test-environment';

beforeAll(async () => {
  await initEnvironment();
});

require('./middleware.spec');
require('./auth.test');
require('./devices.test');
require('./users.test');
require('./companies.test');
require('./messages.test');
