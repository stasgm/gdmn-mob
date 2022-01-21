import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, Platform, FlatList, ActivityIndicator, Text, ListRenderItem } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Divider, Snackbar, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { appActions, authActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';
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

import { IResponse, ISettingsOption } from '@lib/types';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IGood, IReturnDocument, ISellBill, IToken, ISellBillFormParam } from '../../store/types';
import { getDateString } from '../../utils/helpers';

import config from '../../config';

import SellBillItem, { ISellBillListRenderItemProps } from './components/SellBillItem';
import { mockSellBills } from '../../utils/constants';

const onlineUser = config.USER_NAME;
const onlineUserPass = config.USER_PASSWORD;

function SellBillScreen() {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'SellBill'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SellBill'>>();
  const dispatch = useDispatch();

  const returnDoc = docSelectors.selectByDocType<IReturnDocument>('return')?.find((e) => e.id === id);
  const outletId = returnDoc?.head.outlet.id;

  const [barVisible, setBarVisible] = useState(false);
  const [message, setMessage] = useState('');

  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);

  const { data: settings } = useSelector((state) => state.settings);
  const formParams = useSelector((state) => state.app.formParams);
  const { userToken } = useSelector((state) => state.auth);

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

  const [sellBills, setSellBills] = useState<ISellBill[] | undefined>(undefined);

  const bills = useMemo(() => {
    const valueName = goods.find((item) => item.id === docGood?.id)?.valuename || '';
    return sellBills?.map((i) => {
      return {
        docId: returnDoc?.id,
        quantity: i.QUANTITY,
        price: i.PRICE,
        number: i.NUMBER,
        documentdate: i.DOCUMENTDATE,
        contract: i.CONTRACT,
        departName: i.DEPARTNAME,
        sellBillId: i.ID,
        valueName: valueName,
        readonly: false,
        good: docGood,
      } as ISellBillListRenderItemProps;
    });
  }, [goods, sellBills, docGood, returnDoc?.id]);

  const renderItem: ListRenderItem<ISellBillListRenderItemProps> = ({ item }) =>
    returnDoc?.id && docGood ? <SellBillItem item={item} /> : null;

  const setUserToken = useCallback((token: string) => dispatch(authActions.setUserToken(token)), [dispatch]);

  const fetchLogin = async () => {
    const pathLogin = `${serverName}:${serverPort}/v1/login`;
    const userData = {
      username: onlineUser,
      password: onlineUserPass,
    };

    try {
      const tokenFetched = await fetch(pathLogin, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const parsedToken: IResponse<IToken> = await tokenFetched.json();

      if (parsedToken.result) {
        const token: IToken | undefined = parsedToken.data;
        if (token?.access_token) {
          setUserToken(token?.access_token);
          return token.access_token;
        }
      }
      return undefined;
    } catch (e) {
      if (e instanceof TypeError) {
        setMessage(e.message);
      } else {
        setMessage('Неизвестная ошибка');
      }
      setBarVisible(true);
      return undefined;
    }
  };

  const fetchSellBill = async (isFirst = true, parToken: string | undefined = userToken) => {
    if (!(docDateBegin && docDateEnd && docGood && outletId)) {
      return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }
    if (isDemo) {
      setSellBills(mockSellBills);
    } else {
      try {
        setLoading(true);
        const newToken = parToken ?? (await fetchLogin()) ?? '';

        const path = `${serverName}:${serverPort}/v1/sellbills?dateBegin=${docDateBegin}&dateEnd=${docDateEnd}&outletId=${outletId}&goodId=${docGood.id}`;

        const fetched = await fetch(path, {
          headers: {
            authorization: newToken,
          },
        });
        const parsed: IResponse<ISellBill[]> = await fetched.json();

        if (parsed.result) {
          setSellBills(parsed.data);
        } else {
          setMessage(parsed.error || 'Неизвестная ошибка');
          if (parsed.error?.slice(0, 3) === '401') {
            const token = await fetchLogin();
            if (isFirst && token) {
              await fetchSellBill(false, token);
            }
          } else {
            setBarVisible(true);
          }
        }
      } catch (e) {
        if (e instanceof TypeError) {
          setMessage(e.message);
        } else {
          setMessage('Неизвестная ошибка');
        }
        setBarVisible(true);
      }
    }

    setLoading(false);
  };

  const handleSearchSellBills = async () => {
    await fetchSellBill();
  };

  const handleSearchStop = () => {
    setLoading(false);
  };

  return (
    <AppScreen style={localStyles.appScreen}>
      <View style={localStyles.title}>
        <SubTitle>{statusName}</SubTitle>
        {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <View style={localStyles.blank} />}
      </View>
      <Divider />
      <SelectableInput label="Дата начала" value={getDateString(docDateBegin || '')} onPress={handlePresentDateBegin} />
      <SelectableInput label="Дата окончания" value={getDateString(docDateEnd || '')} onPress={handlePresentDateEnd} />
      <SelectableInput label="Товар" value={docGood?.name || ''} onPress={handlePresentGood} />
      <PrimeButton
        icon={!loading ? 'magnify' : 'block-helper'}
        onPress={!loading ? handleSearchSellBills : handleSearchStop}
      >
        {!loading ? 'Найти' : 'Прервать'}
      </PrimeButton>
      {sellBills &&
        (sellBills?.length ? (
          <View style={localStyles.sellBill}>
            <InfoBlock colorLabel={colors.primary} title="Накладные">
              <FlatList
                data={bills}
                keyExtractor={(_, i) => String(i)}
                renderItem={renderItem}
                ItemSeparatorComponent={ItemSeparator}
              />
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
  sellBill: { display: 'flex', flex: 1, padding: 10 },
  appScreen: { justifyContent: 'flex-start' },
  title: { flexDirection: 'row', justifyContent: 'center', padding: 5 },
  blank: { width: 20 },
});
