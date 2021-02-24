import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig, DateObject } from 'react-native-calendars';

import { HeaderRight } from '../../../../components/HeaderRight';
import ItemSeparator from '../../../../components/ItemSeparator';
import SubTitle from '../../../../components/SubTitle';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../../store';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Ферваль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
};
LocaleConfig.defaultLocale = 'ru';

type Props = StackScreenProps<DocumentStackParamList, 'SelectDate'>;

export const SelectDateScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [date, setDate] = useState('');

  const { formName, fieldName, title, value } = route.params;

  const { state, actions } = useAppStore();

  useEffect(() => {
    setDate(value);
  }, [value]);

  const dayPressHandle = (day: DateObject) => {
    setDate(day.dateString);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.setOptions({ animationTypeForReplace: 'push' });
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            actions.setForm({ [formName]: { ...state.forms[formName], [fieldName]: date } });
            navigation.goBack();
          }}
        />
      ),
    });
  }, [actions, date, fieldName, formName, navigation, state.forms]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{title || ''}</SubTitle>
      {date ? (
        <>
          <ItemSeparator />
          <Calendar
            current={date}
            markedDates={{
              [date]: { selected: true, selectedColor: 'orange', disableTouchEvent: true },
            }}
            onDayPress={dayPressHandle}
            firstDay={1}
          />
        </>
      ) : null}
    </View>
  );
};

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  title: {
    padding: 10,
  },
});
