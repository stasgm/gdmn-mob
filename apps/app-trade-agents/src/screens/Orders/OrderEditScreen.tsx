import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { docSelectors, refSelectors, useDispatch } from '@lib/store';
import {
  BackButton,
  useActionSheet,
  AppInputScreen,
  Input,
  ScreenTitle,
  RadioGroup,
  BottomSheet,
} from '@lib/mobile-ui';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { IListItem } from '@lib/mobile-types';

import { INamedEntity, IReference } from '@lib/types';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IContact, IOrderDocument, IOrderLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

const OrderEditScreen = () => {
  const docId = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const ref = useRef<FlatList<IOrderLine>>(null);
  // const isFocused = useIsFocused();

  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const selectedItem = useCallback((listItems: IListItem[], id: string) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id == id));
  }, []);

  const getListItems = <T extends INamedEntity>(con: T[]): IListItem[] =>
    con?.map((item) => ({ id: item.id, value: item.name }));

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === docId);

  const contacts = (refSelectors.selectByName('contact') as IReference<IContact>)?.data;

  const listContact = getListItems(contacts);

  const [status, setStatus] = useState(order?.status || 0);
  const [docNumber, setDocNumber] = useState(order?.number);
  const [docDate, setDocDate] = useState(order?.documentDate || new Date());
  const [onDate, setOnDate] = useState(order?.head.ondate || new Date());
  const [docContact, setDocContact] = useState(order?.head.contact.id);

  const isBlocked = status !== 0;

  const statusName =
    docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа';

  //---Окно календаря для выбора даты документа---
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (_event: any, selectedDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowDate(false);
    if (selectedDate) {
      setDocDate(selectedDate.toISOString().slice(0, 10));
    }
  };

  const handlePresentDocDate = () => {
    setShowDate(true);
    Keyboard.dismiss();
  };

  //---Окно календаря для выбора даты---
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowOnDate(false);
    if (selectedOnDate) {
      setOnDate(selectedOnDate.toISOString().slice(0, 10));
    }
  };

  const handlePresentOnDate = () => {
    setShowDate(true);
    Keyboard.dismiss();
  };

  //---Окно bottomsheet для выбора организации---
  const contactRef = useRef<BottomSheetModal>(null);

  const contact = selectedItem(listContact, docContact || '');

  //Объект подразделения
  const [selectedContact, setSelectedContact] = useState(contact);

  const handlePresentContact = () => {
    Keyboard.dismiss();
    //Если подразделение не указано, то первое подразделение из списка
    if (!(contact ?? listContact?.length)) {
      return;
    }
    setSelectedContact(contact ?? listContact[0]);
    contactRef.current?.present();
  };

  const handleApplyContact = () => {
    setDocContact(selectedContact?.id);
    contactRef.current?.dismiss();
  };

  // useEffect(() => {
  //   setSelectedContact(docContact);
  // }, [docContact]);

  const handleDismissContact = () => contactRef.current?.dismiss();

  return (
    <AppInputScreen>
      <ScreenTitle>{statusName}</ScreenTitle>
      <Input label="Номер документа" value={docNumber} onChangeText={setDocNumber} />
      <Input label="Дата документа" value={getDateString(docDate)} onFocus={handlePresentDocDate} />
      <Input
        label="Организация"
        value={selectedItem(listContact, order?.head.contact.id || '0')?.value}
        onFocus={handlePresentContact}
      />
      {/* <Input label="Дата отгрузки" value={getDateString(onDate)} onFocus={handlePresentOnDate} /> */}
      <BottomSheet
        sheetRef={contactRef}
        title={'Организация'}
        onDismiss={handleDismissContact}
        onApply={handleApplyContact}
      >
        <RadioGroup
          options={listContact}
          onChange={(option) => setSelectedContact(option)}
          activeButtonId={selectedContact?.id}
        />
      </BottomSheet>
      {/* <BottomSheet
        sheetRef={contactRef}
        title={'Магазин'}
        onDismiss={handleDismissContact}
        onApply={handleApplyContact}
      >
        <RadioGroup
          options={listContact}
          onChange={(option) => setSelectedContact(option)}
          activeButtonId={selectedContact?.id}
        />
      </BottomSheet> */}
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docDate)}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={handleApplyDate}
        />
      )}
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(onDate)}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={handleApplyOnDate}
        />
      )}
    </AppInputScreen>
  );
};

export default OrderEditScreen;
