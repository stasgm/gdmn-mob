import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Input, globalStyles as styles, SelectableInput } from '@lib/mobile-ui';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker';

type Props = {
  dsescription?: any;
  item: any;
  onChangeText: (text: string) => void;
  onPress: () => void;
  disabled?: boolean;
};

export const ConditionalRenderItem = ({ onChangeText, onPress, item, disabled, dsescription }: Props) => {
  console.log('type', item.type);
  return (
    <View>
      {/* {item.type === 'string' ? ( */}
      {typeof item === 'string' ? (
        <View style={(styles.container, localStyles.switchContainer)}>
          <Input
            label={dsescription} //{item.description}
            maxLength={40}
            value={item} //{item?.type === 'date' ? getDateString(item?.value || '') : item?.value}
            onChangeText={onChangeText}
            disabled={disabled}
            // clearInput={item.clearInput}
          />
        </View>
      ) :
      item.type === 'ref' ? (
        <SelectableInput
          label={item.description}
          value={item.value ? String(Object.entries(item.value).find((i) => i[0] === 'name')?.[1]) : ''}
          onPress={onPress}
          disabled={disabled}
        />
      ) : (
        <SelectableInput
          label={item.description}
          value={getDateString(item.value)}
          onPress={onPress}
          disabled={disabled}
        />
      )}
    </View>
  );
};

export const localStyles = StyleSheet.create({
  switchContainer: {
    // margin: 5,
  },
});
