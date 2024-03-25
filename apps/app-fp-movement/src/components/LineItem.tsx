import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { globalStyles as styles, MediumText, ListItemLine, LargeText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IMoveLine } from '../store/types';

interface IItem {
  item: IMoveLine; // | IBasedLine;
  disabled?: boolean;
  onPress?: () => void;
  children?: ReactNode;
  isLab?: boolean;
  isFromAddressed?: boolean;
  isToAddressed?: boolean;
}

const LineItem = ({
  item,
  disabled = false,
  onPress,
  children,
  isLab = false,
  isFromAddressed = false,
  isToAddressed = false,
}: IItem) => {
  return (
    <ListItemLine readonly={disabled} onPress={onPress}>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.good.name}</LargeText>
        <View style={styles.flexDirectionRow}>
          <MaterialCommunityIcons name="shopping-outline" size={18} />
          <MediumText>
            {(item.weight || 0).toString()} кг{isLab ? '' : `, ${(item.quantPack || 0).toString()} кор.`}
          </MediumText>
        </View>
        <View style={styles.flexDirectionRow}>
          <MediumText>
            Партия № {item.numReceived || ''} от {getDateString(item.workDate) || ''}
          </MediumText>
        </View>
        {isFromAddressed ? (
          <View style={styles.flexDirectionRow}>
            <MediumText>Откуда: {item.fromCell || ''}</MediumText>
          </View>
        ) : null}
        {isToAddressed ? (
          <View style={styles.flexDirectionRow}>
            <MediumText>
              {isFromAddressed ? 'Куда:' : 'Ячейка №'} {item.toCell || ''}
            </MediumText>
          </View>
        ) : null}
        {children}
      </View>
    </ListItemLine>
  );
};

export default LineItem;
