import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useLayoutEffect, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IFilterParams } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'FilterEdit'>;

const Line = React.memo(
  ({ name, title, selected, onPress }: { name: string; title: string; selected: boolean; onPress: () => void }) => {
    const { colors } = useTheme();
    return (
      <>
        <TouchableOpacity onPress={onPress}>
          <View key={name} style={localStyles.line}>
            <Text style={localStyles.fontSize18}>{title}</Text>
            {selected && <MaterialIcons name="check" size={30} color={colors.primary} />}
          </View>
        </TouchableOpacity>
        <ItemSeparator />
      </>
    );
  },
);

const FilterEditScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const { fieldSearch } = useMemo(() => {
    return ((state.forms?.filterParams as unknown) || {}) as IFilterParams;
  }, [state.forms?.filterParams]);

  const setFieldSearch = (field: string) =>
    actions.setForm({
      filterParams: {
        ...state.forms?.filterParams,
        fieldSearch: fieldSearch?.some((item) => item === field)
          ? fieldSearch.filter((item) => item !== field)
          : [...fieldSearch, field],
      },
    });

  useEffect(() => {
    if (state.forms?.filterParams) {
      return;
    }
    actions.setForm({ filterParams: { fieldSearch: [] } });
  }, [actions, state.forms?.filterParams]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            actions.clearForm('filterParams');
            navigation.navigate('DocumentList');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            navigation.navigate('DocumentList');
          }}
        />
      ),
    });
  }, [actions, fieldSearch, navigation]);

  return (
    <View
      style={[
        styles.container,
        localStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Настройки фильтра</SubTitle>
      <Line
        name="number"
        title={'Номер документа'}
        selected={fieldSearch?.some((item) => item === 'number')}
        onPress={() => setFieldSearch('number')}
      />
      <Line
        name="state"
        title={'Статус'}
        selected={fieldSearch?.some((item) => item === 'state')}
        onPress={() => setFieldSearch('state')}
      />
      {/* <Line
        name="toContact"
        title={'Организация'}
        selected={fieldSearch?.some((item) => item === 'toContact')}
        onPress={() => setFieldSearch('toContact')}
      /> */}
      <Line
        name="fromContact"
        title={'Подразделение'}
        selected={fieldSearch?.some((item) => item === 'fromContact')}
        onPress={() => setFieldSearch('fromContact')}
      />
      {/* <Line
        name="expeditor"
        title={'Экспедитор'}
        selected={fieldSearch?.some((item) => item === 'expeditor')}
        onPress={() =>
          !fieldSearch?.some((item) => item === 'expeditor')
            ? setFieldSearch([...fieldSearch, 'expeditor'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'expeditor'))
        }
      /> */}
    </View>
  );
};

export { FilterEditScreen };

const localStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  fontSize18: {
    fontSize: 18,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    padding: 10,
  },
});
