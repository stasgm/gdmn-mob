import React from 'react';
import { View } from 'react-native';

import { getDateString } from '@lib/mobile-hooks';

import styles from '../styles/global';

import { MediumText } from './AppText';

interface IProps {
  sentDate?: string | undefined;
  erpCreationDate?: string | undefined;
}

const DateInfo = ({ sentDate, erpCreationDate }: IProps) => {
  return (
    <>
      {sentDate ? (
        <View style={styles.rowCenter}>
          <MediumText>
            Отправлено: {getDateString(sentDate)} {new Date(sentDate).toLocaleTimeString('ru', { hour12: false })}
          </MediumText>
        </View>
      ) : null}
      {erpCreationDate ? (
        <View style={styles.rowCenter}>
          <MediumText>
            Обработано: {getDateString(erpCreationDate)}{' '}
            {new Date(erpCreationDate).toLocaleTimeString('ru', { hour12: false })}
          </MediumText>
        </View>
      ) : null}
    </>
  );
};

export default DateInfo;
