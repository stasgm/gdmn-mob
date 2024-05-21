import { IDocument } from '@lib/types';
import { customAlphabet } from 'nanoid';

import { Audio } from 'expo-av';

import { Alert } from 'react-native';

import { IBarcodeSum } from '../store/app/types';

export const getNextDocNumber = (documents: IDocument[]) => {
  return (
    documents
      ?.map((item) => parseInt(item.number, 10))
      .reduce((newId, currId) => (newId > currId ? newId : currId), 0) + 1 || 1
  ).toString();
};

export const jsonFormat = (str: any) => {
  return JSON.stringify(str, null, '\t');
};

export const getEan13Barcode = () => {
  const barcode = customAlphabet('0123456789', 12)();

  const arr: IBarcodeSum = barcode.split('').reduce(
    (prev: IBarcodeSum, cur: string, index: number) => {
      if ((index + 1) % 2 === 0) {
        prev = { ...prev, evenSum: prev.evenSum + Number(cur) };
      } else {
        prev = { ...prev, oddSum: prev.oddSum + Number(cur) };
      }
      return prev;
    },
    { evenSum: 0, oddSum: 0 },
  );

  const res =
    barcode + (Math.ceil((arr.evenSum * 3 + arr.oddSum) / 10) * 10 - (arr.evenSum * 3 + arr.oddSum)).toString();
  return res;
};

export const alertWithSound = (label: string, text: string, onClose?: () => void) => {
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/error.wav'));
    await sound.playAsync();
  };

  playSound();
  Alert.alert(label, text, [{ text: 'OK', onPress: onClose }]);
};
