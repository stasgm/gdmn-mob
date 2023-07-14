const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;

// Маршрут для получения переменной окружения
app.get('/env/', (req, res) => {
  const PORT = process.env.PORT;
  const HTTPS_PORT = process.env.HTTPS_PORT;
  const HOST = process.env.HOST;
  const ADMIN_CONTAINER_PORT = process.env.ADMIN_CONTAINER_PORT;

  console.log('ADMIN_CONTAINER_PORT', ADMIN_CONTAINER_PORT);

  const serverConfig =
    ADMIN_CONTAINER_PORT === '80'
      ? {
          protocol: 'http://',
          server: HOST || 'localhost',
          port: PORT || 3654,
        }
      : {
          protocol: 'https://',
          server: 'server.gdmn.app',
          port: HTTPS_PORT || 3655,
        };

  // if (PORT) {
  res.json(serverConfig);
  // } else {
  //   res.status(404).json({ error: 'Variable not found' });
  // }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
