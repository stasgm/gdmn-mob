import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import { INamedEntity, ISettingsOption } from '@lib/types';

import SettingsItem from './SettingsItem';
import { LargeText, MediumText } from './AppText';

type Props = {
  groupDescription?: string;
  list: ISettingsOption[];
  onValueChange: (optionName: string, value: ISettingsOption) => void;
  onCheckSettings?: (optionName: string, value: ISettingsOption) => void;
};

const SettingsGroup = ({ groupDescription, list, onValueChange, onCheckSettings }: Props) => {
  //Массив уникальных подгрупп группы настройки
  const parents = useMemo(
    () =>
      list.reduce((prev: INamedEntity[], value: ISettingsOption) => {
        if (value?.groupInGroup === undefined || prev.find((gr) => gr.id === value?.groupInGroup?.id)) {
          return prev;
        }
        return [...prev, value.groupInGroup];
      }, []),
    [list],
  );

  return (
    <View>
      {groupDescription ? (
        <View>
          <LargeText style={localStyles.title}>{groupDescription}</LargeText>
        </View>
      ) : null}
      <View>
        {list
          .filter((l) => !l.groupInGroup)
          .map((item) => {
            return (
              <View key={item.id}>
                <Divider />
                <SettingsItem
                  label={item.description || item.id}
                  value={item.data}
                  disabled={item.readonly}
                  onValueChange={(newValue) => onValueChange(item.id, { ...item, data: newValue })}
                  onEndEditing={(newValue) => onCheckSettings && onCheckSettings(item.id, { ...item, data: newValue })}
                />
              </View>
            );
          })}
        {parents.length > 0 && <Divider />}
        {parents.map((group) => {
          return (
            <View key={group.id}>
              <MediumText style={localStyles.title}>{group.name}</MediumText>
              {Object.values(list)
                .filter((item) => item?.visible && item.groupInGroup?.id === group.id)
                .sort((itema, itemb) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0))
                .map((s, xid) => (
                  <View key={s.id}>
                    {xid > 0 && <Divider />}
                    <SettingsItem
                      label={s.description || s.id}
                      value={s.data}
                      disabled={s.readonly}
                      onValueChange={(newValue) => onValueChange(s.id, { ...s, data: newValue })}
                      onEndEditing={(newValue) => onCheckSettings && onCheckSettings(s.id, { ...s, data: newValue })}
                    />
                  </View>
                ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 5,
  },
  title: {
    margin: 3,
    textAlign: 'center',
  },
  container: {
    marginTop: 5,
  },
});

export default SettingsGroup;
