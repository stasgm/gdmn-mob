import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, Platform, FlatList, Text } from 'react-native';
import { RouteProp, StackActions, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, useTheme } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import {
  docSelectors,
  documentActions,
  refSelectors,
  useDispatch as useDocDispatch,
  useSelector,
  appActions,
  useDispatch,
} from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  Input,
  SelectableInput,
  SaveButton,
  globalStyles as styles,
  AppScreen,
  SubTitle,
  PrimeButton,
  ItemSeparator,
} from '@lib/mobile-ui';

import { IDocumentType, INamedEntity, IReference } from '@lib/types';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { ISellBill, IOutlet } from '../../store/types';

import { getDateString } from '../../utils/helpers';
import { ISellFormParam } from '../../store/app/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReturnSellBillScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnSellBill'>>().params?.id;
  const name = useRoute<RouteProp<ReturnsStackParamList, 'ReturnSellBill'>>().params?.name;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnSellBill'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const bill = docSelectors.selectByDocType<ISellBill>('bill')?.find((e) => e.id === id);

  const billType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'bill');

  const formParams = useSelector((state) => state.app.formParams as ISellFormParam);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const {
    contact: docContact,
    outlet: docOutlet,
    depart: docDepart,
    number: docNumber,
    documentDateBegin: docDocumentDateBegin,
    documentDateEnd: docDocumentDateEnd,
    documentDate: docDocumentDate,
    onDate: docOnDate,
    route: docRoute,
  } = useMemo(() => {
    return formParams;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === docOutlet?.id);

  useEffect(() => {
    if (!docContact && !!docOutlet) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['contact']: outlet?.company,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docOutlet, outlet?.company]);

  useEffect(() => {
    if (!!docContact && !!docOutlet && docContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['outlet']: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    if (bill) {
      dispatch(
        appActions.setFormParams({
          number: bill.number,
          contact: bill.head.contact,
          outlet: bill.head.outlet,
          onDate: bill.head.onDate,
          documentDate: bill.documentDate,
          route: bill.head.route,
          depart: bill.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          depart: defaultDepart,
        }),
      );
    }
  }, [dispatch, bill, defaultDepart]);

  const handleSave = useCallback(() => {
    if (!billType) {
      return Alert.alert('Ошибка!', 'Тип документа для отправления базовой накладной не найден', [{ text: 'OK' }]);
    }

    if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    const newBillDate = new Date().toISOString();

    if (!id) {
      const newBill: ISellBill = {
        id: docId,
        documentType: billType,
        number: docNumber,
        documentDate: newBillDate,
        head: {
          contact: docContact,
          onDate: docOnDate,
          outlet: docOutlet,
          depart: docDepart,
        },
        lines: [],
        creationDate: newBillDate,
        editionDate: newBillDate,
        status: 'READY',
      };

      docDispatch(documentActions.addDocument(newBill));
    } else {
      if (!bill) {
        return;
      }
    }

    // добавить navigation куда перейти после отправки
  }, [billType, docNumber, docContact, docOutlet, docOnDate, docDocumentDate, id, docDepart, docDispatch, bill]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [dispatch, handleSave, navigation]);

  const statusName = 'Базовая накладная';

  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    setShowOnDate(false);
  };

  const handlePresentOnDate = () => {
    setShowOnDate(true);
  };

  const handlePresentContact = () => {
    if (docRoute) {
      return Alert.alert('Внимание!', 'Нельзя менять организацию! Документ возврата привязан к маршруту.', [
        { text: 'OK' },
      ]);
    }

    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact && [docContact],
    });
  };

  const handlePresentOutlet = () => {
    if (docRoute) {
      return Alert.alert('Внимание!', 'Нельзя менять магазин! Документ возврата привязан к маршруту.', [
        { text: 'OK' },
      ]);
    }

    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      clause: params,
      value: docOutlet && [docOutlet],
    });
  };

  const handlePresentDepart = () => {
    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'depart',
      value: docDepart && [docDepart],
    });
  };

  const { colors } = useTheme();
  // const { docId, name } = useRoute<RouteProp<ReturnsStackParamList, 'SelectItemReturn'>>().params;

  const list = refSelectors.selectByName<INamedEntity>(name);

  // const filteredList = useMemo(() => {
  //   return (
  //     list?.data.filter((i) => (i.name ? i.name.toUpperCase() : true))?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
  //   );
  // }, [list?.data]);

  const refList = React.useRef<FlatList<INamedEntity>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: INamedEntity }) => {
    return (
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.rowCenter}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name || item.id}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <Input
        label="Номер документа"
        value={docNumber}
        onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
        // disabled={isBlocked}
      />
      <SelectableInput label="Начальная дата" value={getDateString(docOnDate || '')} onPress={handlePresentOnDate} />
      <SelectableInput label="Конечная дата" value={getDateString(docOnDate || '')} onPress={handlePresentOnDate} />
      <SelectableInput
        label="Организация"
        placeholder="Выберите организацию..."
        value={docContact?.name}
        onPress={handlePresentContact}
        // disabled={isBlocked}
      />
      <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} /*disabled={isBlocked}*/ />
      <SelectableInput label="Товар" value={docOutlet?.name} onPress={handlePresentOutlet} /*disabled={isBlocked}*/ />
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docOnDate || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDate}
        />
      )}
      <View>
        <PrimeButton outlined /*onPress={handle}*/>Отправить</PrimeButton>
      </View>
      {/* <AppScreen>
        <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>{list?.name}</SubTitle>
        <Divider />
        <FlatList
          ref={refList}
          data={filteredList}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
      </AppScreen> */}
    </AppInputScreen>
  );
};

export default ReturnSellBillScreen;

// const localStyles = StyleSheet.create({
//   switchContainer: {
//     margin: 10,
//   },
// });
