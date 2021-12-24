import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Input, globalStyles as styles, SelectableInput } from '@lib/mobile-ui';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker';
import { DrawerItem } from '@react-navigation/drawer';
import { RefTypeChoose } from '@lib/types';

type Props = {
  type?: RefTypeChoose | string | undefined;
  value?: any;
  sortOrder?: number;
  description?: any;
  item: any;
  clearInput?: boolean | unknown;
  onChangeText: (text: string) => void;
  onPress: () => void;
  disabled?: boolean;
};

export const ConditionalRenderItem = ({
  onChangeText,
  onPress,
  item,
  disabled,
  description,
  type,
  value,
  sortOrder,
  clearInput,
}: Props) => {
  return (
    <View>
      {type === 'string' ? (
        // {typeof item === 'string' ? (
        <View style={(styles.container, localStyles.switchContainer)}>
          <Input
            label={description} //{item.description}
            maxLength={40}
            value={item} //{item?.type === 'date' ? getDateString(item?.value || '') : item?.value}
            onChangeText={onChangeText}
            disabled={disabled}
            clearInput={!disabled && clearInput}
          />
        </View>
      ) : type === 'ref' ? (
        <SelectableInput
          label={description}
          value={item ? String(Object.entries(item).find((i) => i[0] === 'name')?.[1]) : ''}
          onPress={onPress}
          disabled={disabled}
        />
      ) : (
        <SelectableInput label={description} value={getDateString(item)} onPress={onPress} disabled={disabled} />
      )}
    </View>
  );
};

export const localStyles = StyleSheet.create({
  switchContainer: {
    // margin: 5,
  },
});
