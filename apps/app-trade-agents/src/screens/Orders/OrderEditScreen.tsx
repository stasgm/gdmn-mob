import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { docSelectors, documentActions } from '@lib/store';
import { BackButton, AppInputScreen, Input, ScreenTitle, SaveButton } from '@lib/mobile-ui';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderHead } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';
import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';

const OrderEditScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === id);

  const [status, setStatus] = useState(order?.status || 0);
  const [docNumber, setDocNumber] = useState(order?.number);
  const [onDate, setOnDate] = useState(order?.head.ondate || new Date());
  const [docContact, setDocContact] = useState(order?.head.contact);
  const [docOutlet, setDocOutlet] = useState(order?.head.outlet);

  const formParams = useSelector((state) => state.app.formParams);

  const { contact, outlet } = useMemo(() => {
    return (formParams || {}) as Partial<IOrderHead>;
  }, [formParams]);

  useFocusEffect(
    React.useCallback(() => {
      const cleanFormParams = () => dispatch(appActions.cleanFormParams());

      return () => cleanFormParams();
    }, [dispatch]),
  );

  useEffect(() => {
    setDocContact(contact);
  }, [contact]);

  useEffect(() => {
    setDocOutlet(outlet);
  }, [outlet]);

  const handleSave = () => {
    return;
  };
  // const handleSave = useCallback(() => {
  //   if (!id) {
  //     dispatch(documentActions.addDocument({ docId, line }));
  //   } else {
  //     dispatch(documentActions.updateDocument({ docId, line }));
  //   }

  //   // navigation.goBack();
  //   navigation.navigate('OrderView', { id: docId });
  // }, [navigation, line, docId, dispatch, mode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation]);

  const isBlocked = status !== 0;

  const statusName =
    id !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа';

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
    setShowOnDate(true);
  };

  const handlePresentContact = () => {
    navigation.navigate('SelectItem', {
      refName: 'contact',
      fieldName: 'contact',
      title: 'Организация',
      value: order?.head.contact || docContact,
    });
  };

  const handlePresentOutlet = () => {
    navigation.navigate('SelectItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      title: 'Магазин',
      value: order?.head.outlet || docOutlet,
    });
  };

  return (
    <AppInputScreen>
      <ScreenTitle>{statusName}</ScreenTitle>
      <Input label="Номер документа" value={docNumber} onChangeText={setDocNumber} />
      {/* <Input label="Дата документа" value={getDateString(docDate)} editable={false} /> */}
      <TouchableOpacity onPress={handlePresentOnDate}>
        <Input label="Дата отгрузки" value={getDateString(onDate)} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentContact}>
        <Input label="Организация" value={docContact?.name} editable={false} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePresentOutlet}>
        <Input label="Магазин" value={docOutlet?.name} editable={false} />
      </TouchableOpacity>
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
