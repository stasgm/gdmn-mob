import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { asyncStorage } from 'reactotron-react-native';

import config from '../config';

/* export const rc = Reactotron.configure()
  .use(asyncStorage({ ignore: [] })) // <--- here we go!
  .connect(); */
// Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'Mob Inventory App',
    host: config.server.name,
    port: 9090,
  }) // controls connection & communication settings
  .use(asyncStorage({ ignore: [] }))
  .useReactNative({ devTools: true }) // add all built-in react native plugins
  .connect(); // let's connect!

// Reactotron.onCustomCommand('appStore', () => console.log('test'));

Reactotron.onCustomCommand({
  command: 'Clear AsyncStorage',
  handler: () => {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => {
        // eslint-disable-next-line no-alert
        alert('AsyncStorage cleared.');
      });
  },

  title: 'Clear AsyncStorage',
  description: 'Clears all data from AsyncStorage.',
});

Reactotron.onCustomCommand({
  command: 'Get AsyncStorage',
  handler: () => {
    AsyncStorage.getAllKeys()
      .then((keys) =>
        keys.map((key) => {
          Reactotron.display({
            name: `Storage: ${key}`,
            value: AsyncStorage.getItem(key),
            important: true,
          });
        }),
      )
      .then(() => {
        // eslint-disable-next-line no-alert
        alert('AsyncStorage showed.');
      });
  },

  title: 'Show AsyncStorage',
  description: 'Shows all data at AsyncStorage.',
});
