import { Alert } from 'react-native';

import { Audio } from 'expo-av';

export const AlertWithSound = ({ text }: { text: string }) => {
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/error.wav'));
    await sound.playAsync();
  };

  playSound();
  return Alert.alert('Внимание!', `${text}!`, [{ text: 'OK' }]);
};
