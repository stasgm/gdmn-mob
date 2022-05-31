import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, Platform, FlatList, ActivityIndicator, Text, ListRenderItem } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Divider, Snackbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { appActions, docSelectors, refSelectors, useSelector } from '@lib/store';
import { SelectableInput, SubTitle, PrimeButton, InfoBlock, ItemSeparator, AppScreen, Theme } from '@lib/mobile-ui';

import { IResponse, ISettingsOption } from '@lib/types';

import { getDateString } from '@lib/mobile-app';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IGood, IReturnDocument, ISellBill, IToken, ISellBillFormParam } from '../../store/types';
import config from '../../config';

import { useDispatch, useSelector as useAppSelector, appTradeActions } from '../../store';

import { navBackButton } from '../../components/navigateOptions';

import { mockSellBills } from '../../store/mock';

import SellBillItem, { ISellBillListRenderItemProps } from './components/SellBillItem';

const onlineUser = config.USER_NAME;
const onlineUserPass = config.USER_PASSWORD;

const fetchWithTimeOut = (url: string, options: RequestInit, timeout = config.TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error('Превышено время ожидания!')), timeout)),
  ]);
};

function SellBillScreen() {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'SellBill'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SellBill'>>();
  const dispatch = useDispatch();

  const returnDoc = id ? docSelectors.selectByDocId<IReturnDocument>(id) : undefined;
  const outletId = returnDoc?.head.outlet.id;

  const [barVisible, setBarVisible] = useState(false);
  const [message, setMessage] = useState('');

  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);

  const { data: settings } = useSelector((state) => state.settings);
  const formParams = useSelector((state) => state.app.formParams);

  const userToken = useAppSelector((state) => state.appTrade.userToken);

  const isDemo = useSelector((state) => state.auth.isDemo);

  const {
    dateBegin: docDateBegin,
    dateEnd: docDateEnd,
    good: docGood,
  } = useMemo(() => {
    return formParams as ISellBillFormParam;
  }, [formParams]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const returnDocTime = (settings.returnDocTime as ISettingsOption<number>).data || 0;
  const serverName = (settings.serverName as ISettingsOption<string>).data || 0;
  const serverPort = (settings.serverPort as ISettingsOption<string>).data || 0;

  const maxDocDate = new Date();
  maxDocDate.setDate(maxDocDate.getDate() - returnDocTime);

  useEffect(() => {
    // Инициализируем параметры
    dispatch(
      appActions.setFormParams({
        dateBegin: maxDocDate.toISOString().slice(0, 10),
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
      headerLeft: navBackButton,
    });
  }, [dispatch, navigation]);

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

  const [sellBills, setSellBills] = useState<ISellBill[] | undefined>(undefined);

  const bills = useMemo(() => {
    const valueName = goods.find((item) => item.id === docGood?.id)?.valueName || '';
    return sellBills?.map((i) => {
      return {
        docId: returnDoc?.id,
        quantity: i.quantity,
        price: i.price,
        number: i.number,
        documentdate: i.documentdate,
        contract: i.contract?.name,
        departName: i.depart?.name,
        sellBillId: i.id,
        valueName: valueName,
        readonly: false,
        good: docGood,
      } as ISellBillListRenderItemProps;
    });
  }, [goods, sellBills, docGood, returnDoc?.id]);

  const renderItem: ListRenderItem<ISellBillListRenderItemProps> = ({ item }) =>
    returnDoc?.id && docGood ? <SellBillItem item={item} /> : null;

  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    return () => {
      setUnmounted(true);
    };
  }, []);

  const handleSearchSellBills = useCallback(async () => {
    setSellBills(undefined);
    setLoading(true);
    /**
     * Аутентификация пользователя
     * @returns Токен
     */
    const fetchLogin = async () => {
      const pathLogin = `${serverName}:${serverPort}/v1/login`;

      const userData = {
        username: onlineUser,
        password: onlineUserPass,
      };

      try {
        const tokenFetched = await fetchWithTimeOut(pathLogin, {
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const parsedToken: IResponse<IToken> = await (tokenFetched as Response).json();

        if (parsedToken.result) {
          const token = parsedToken.data;
          if (token?.access_token) {
            dispatch(appTradeActions.setUserToken(token.access_token));
            return token.access_token;
          }
        }
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Ошибка при подключении!');
      }
      return undefined;
    };

    const fetchSellBill = async (isFirst = true, parToken: string | undefined = userToken) => {
      if (!(docDateBegin && docDateEnd && docGood && outletId)) {
        return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      if (isDemo) {
        setSellBills(mockSellBills);
      } else {
        try {
          const newToken = parToken ?? (await fetchLogin()) ?? '';

          const path = `${serverName}:${serverPort}/v1/sellbills?dateBegin=${docDateBegin}&dateEnd=${docDateEnd}&outletId=${outletId}&goodId=${docGood.id}`;

          const fetched = await fetch(path, {
            headers: {
              authorization: newToken,
            },
          });

          const parsed: IResponse<ISellBill[]> = await fetched.json();

          if (parsed.result) {
            if (!unmounted) {
              setSellBills(parsed.data);
            }
          } else {
            //Если пришла ошибка токена, то логинимся и повторно пытаемся получить накладные
            if (parsed.error?.slice(0, 3) === '401') {
              const token = await fetchLogin();
              if (isFirst && token) {
                await fetchSellBill(false, token);
              }
            } else {
              if (!unmounted) {
                setMessage(parsed.error || 'Ошибка при получении накладных!');
                setBarVisible(true);
              }
            }
          }
        } catch (e) {
          if (!unmounted) {
            if (e instanceof Error) {
              setMessage(e.message);
            } else {
              setMessage('Ошибка при запросе накладных!');
            }
            setBarVisible(true);
          }
        }
      }
    };

    await fetchSellBill();

    setLoading(false);
  }, [dispatch, docDateBegin, docDateEnd, docGood, isDemo, outletId, serverName, serverPort, unmounted, userToken]);

  return (
    <AppScreen style={localStyles.appScreen}>
      <View style={localStyles.title}>
        <SubTitle>Поиск накладных</SubTitle>
        {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <View style={localStyles.blank} />}
      </View>
      <Divider />
      <SelectableInput
        label="Дата начала"
        value={getDateString(docDateBegin || '')}
        onPress={handlePresentDateBegin}
        disabled={loading}
      />
      <SelectableInput
        label="Дата окончания"
        value={getDateString(docDateEnd || '')}
        onPress={handlePresentDateEnd}
        disabled={loading}
      />
      <SelectableInput label="Товар" value={docGood?.name || ''} onPress={handlePresentGood} disabled={loading} />
      <PrimeButton
        icon={'magnify'}
        onPress={handleSearchSellBills}
        disabled={loading || !(docDateBegin && docDateEnd && docGood && outletId)}
      >
        {'Найти'}
      </PrimeButton>
      {sellBills &&
        (sellBills?.length ? (
          <View style={localStyles.sellBill}>
            <InfoBlock colorLabel={colors.primary} title="Накладные">
              <View style={localStyles.list}>
                <FlatList
                  data={bills}
                  keyExtractor={(_, i) => String(i)}
                  renderItem={renderItem}
                  scrollEventThrottle={400}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>
            </InfoBlock>
          </View>
        ) : (
          <View style={localStyles.title}>
            <Text>Накладные не найдены</Text>
          </View>
        ))}
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
}

export default SellBillScreen;

const localStyles = StyleSheet.create({
  sellBill: { display: 'flex', flex: 1, padding: 10, marginBottom: 10 },
  appScreen: { justifyContent: 'flex-start' },
  title: { flexDirection: 'row', justifyContent: 'center', padding: 5 },
  blank: { width: 20 },
  list: { marginBottom: 20 },
});
