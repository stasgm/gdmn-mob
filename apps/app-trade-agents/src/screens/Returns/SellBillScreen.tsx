import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, Platform, FlatList, ActivityIndicator, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Divider, Snackbar, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  BackButton,
  SelectableInput,
  SubTitle,
  PrimeButton,
  InfoBlock,
  ItemSeparator,
  AppScreen,
  Theme,
} from '@lib/mobile-ui';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IGood, IReturnDocument, ISellBill } from '../../store/types';
import { ISellBillFormParam } from '../../store/app/types';
import { getDateString } from '../../utils/helpers';

import SellBillItem from './components/SellBillItem';
import { IResponse } from '@lib/types';

const SellBillScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'SellBill'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SellBill'>>();
  const dispatch = useDispatch();

  const returnDoc = docSelectors.selectByDocType<IReturnDocument>('return')?.find((e) => e.id === id);
  const outletId = returnDoc?.head.outlet.id;

  const [barVisible, setBarVisible] = useState(false);
  const [message, setMessage] = useState('');

  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);

  const formParams = useSelector((state) => state.app.formParams);

  const {
    dateBegin: docDateBegin,
    dateEnd: docDateEnd,
    good: docGood,
  } = useMemo(() => {
    return formParams as ISellBillFormParam;
  }, [formParams]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(appActions.clearFormParams());
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const time = 30;
  const maxDocDate = new Date();
  maxDocDate.setDate(maxDocDate.getDate() - time);

  useEffect(() => {
    // Инициализируем параметры
    dispatch(
      appActions.setFormParams({
        dateBegin: time > 0 ? maxDocDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        dateEnd: new Date().toISOString().slice(0, 10),
        good: undefined,
      }),
    );
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [dispatch, navigation]);

  const statusName = 'Поиск накладных';

  const handlePresentGood = () => {
    navigation.navigate('SelectRefItem', {
      refName: 'good',
      fieldName: 'good',
      value: docGood && [docGood],
    });
  };

  const [showDateBegin, setShowDateBegin] = useState(false);
  const handleApplyDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowDateBegin(false);

    if (selectedDateBegin) {
      dispatch(appActions.setFormParams({ dateBegin: selectedDateBegin.toISOString().slice(0, 10) }));
    }
  };
  const handlePresentDateBegin = () => {
    setShowDateBegin(true);
  };

  const [showDateEnd, setShowDateEnd] = useState(false);
  const handleApplyDateEnd = (_event: any, selectedDateEnd: Date | undefined) => {
    setShowDateEnd(false);

    if (selectedDateEnd) {
      dispatch(appActions.setFormParams({ dateEnd: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };
  const handlePresentDateEnd = () => {
    setShowDateEnd(true);
  };

  const [sellBills, setSellBills] = useState<ISellBill[]>();
  const [error, setError] = useState<string | undefined>();

  // const handleShowSellBill = () => {
  //   if (!(docDateBegin && docDateEnd && docGood)) {
  //     return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
  //   }
  //   // setSellBills(true);
  // };

  const valueName = goods.find((item) => item.id === docGood?.id)?.valuename || '';

  const renderItem = ({ item }: { item: ISellBill }) =>
    returnDoc?.id && docGood ? (
      <SellBillItem docId={returnDoc?.id} item={item} valueName={valueName} good={docGood} />
    ) : null;

  const handleSearchSellBills = async () => {
    if (!(docDateBegin && docDateEnd && docGood && outletId)) {
      return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    try {
      setLoading(true);
      const path = `http://192.168.0.70:8000/v1/sellbills?dateBegin=${docDateBegin}&dateEnd=${docDateEnd}&outletId=${outletId}&goodId=${docGood.id}`;
      console.log('path', path);
      const fetched = await fetch(path, {});
      const parsed: IResponse<ISellBill[]> = await fetched.json();
      if (parsed.result) {
        setSellBills(parsed.data);
      } else {
        setError(parsed.error);
      }
      // setSellBills(parsed);
      setLoading(false);
      console.log('parsed', parsed);
      console.log('sell', sellBills);
      // const b = sellBills.find((item) => item.)
    } catch (e) {
      if (e instanceof TypeError) {
        setMessage(e.message);
      } else {
        setMessage('Неизвестная ошибка');
        console.log('ghjdthrf', sellBills);
      }
      setBarVisible(true);
      // console.error('Error', e);
    }
  };
  console.log('message', message);

  const handleSearchStop = () => {
    setLoading(false);
  };

  console.log('bill', sellBills);

  return (
    <AppScreen style={localStyles.appScreen}>
      <View style={localStyles.title}>
        <SubTitle>{statusName}</SubTitle>
        {loading && <ActivityIndicator size="small" color="#70667D" style={localStyles.activity} />}
      </View>
      <Divider />
      <SelectableInput
        label="Начальная дата"
        value={getDateString(docDateBegin || '')}
        onPress={handlePresentDateBegin}
      />
      <SelectableInput label="Конечная дата" value={getDateString(docDateEnd || '')} onPress={handlePresentDateEnd} />
      <SelectableInput label="Товар" value={docGood?.name} onPress={handlePresentGood} />
      <PrimeButton
        icon={!loading ? 'magnify' : 'block-helper'}
        onPress={!loading ? handleSearchSellBills : handleSearchStop}
      >
        {!loading ? 'Найти' : 'Прервать'}
      </PrimeButton>
      {!!sellBills?.length && (
        <View style={localStyles.sellBill}>
          <InfoBlock colorLabel={colors.primary} /*"#a91160" /*"#4479D4"*/ title="Накладные">
            <FlatList
              data={sellBills}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              // scrollEventThrottle={1}
              ItemSeparatorComponent={ItemSeparator}
            />
          </InfoBlock>
        </View>
      )}
      {error && (
        <View style={localStyles.error}>
          <Text>{error}</Text>
        </View>
      )}
      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docDateBegin || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}
      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docDateEnd || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateEnd}
        />
      )}
      <Snackbar
        visible={barVisible}
        onDismiss={() => setBarVisible(false)}
        style={{ backgroundColor: Theme.colors.error }}
        action={{
          icon: 'close',
          label: '',
          onPress: () => {
            setBarVisible(false);
          },
        }}
      >
        {message}
      </Snackbar>
    </AppScreen>
  );
};

export default SellBillScreen;

const localStyles = StyleSheet.create({
  sellBill: { display: 'flex', flex: 1, padding: 10 },
  appScreen: { justifyContent: 'flex-start' },
  title: { flexDirection: 'row', justifyContent: 'center', padding: 5 },
  activity: { paddingLeft: 5 },
  error: { display: 'flex', alignItems: 'center', padding: 5 },
});
