import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SelectableInput, Input, SaveButton, SubTitle, AppScreen, navBackButton } from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-hooks';

import { IDocumentType, INamedEntity, IReference, ScreenState } from '@lib/types';

import { DashboardStackParamList } from '@lib/mobile-navigation';

import { ReceiptStackParamList } from '../../navigation/Root/types';
import { IReceiptFormParam, IReceiptDocument } from '../../store/types';
import { alertWithSound, getNextDocNumber } from '../../utils/helpers';
import { IAddressStoreEntity } from '../../store/app/types';

export const ReceiptEditScreen = () => {
  const id = useRoute<RouteProp<ReceiptStackParamList, 'ReceiptEdit'>>().params?.id;
  const navigation =
    useNavigation<StackNavigationProp<ReceiptStackParamList & DashboardStackParamList, 'ReceiptEdit'>>();
  const dispatch = useDispatch();
  const navState = navigation.getState();
  const screenName = navState.routes.some((route) => route.name === 'Dashboard')
    ? 'ReceiptEditScreenDashboard'
    : 'ReceiptEditScreen';

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const receipts = useFilteredDocList<IReceiptDocument>('receipt');

  const doc = receipts?.find((e) => e.id === id);

  const departs = refSelectors.selectByName<IAddressStoreEntity>('depart')?.data;

  const userDefaultDepart = useSelector((state) => state.settings?.userData?.depart?.data) as INamedEntity;
  const defaultDepart = departs?.find((i) => i.id === userDefaultDepart?.id);

  const movementType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'receipt');

  const forms = useSelector((state) => state.app.screenFormParams);

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    fromDepart: docFromDepart,
    toDepart: docToDepart,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
  } = (forms && forms[screenName] ? forms[screenName] : {}) as IReceiptFormParam;

  useEffect(() => {
    return () => {
      dispatch(appActions.clearScreenFormParams(screenName));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Инициализируем параметры
    if (doc) {
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: {
            number: doc.number,
            documentDate: doc.documentDate,
            status: doc.status,
            comment: doc.head.comment,
            fromDepart: doc.head.fromDepart,
            toDepart: doc.head.toDepart,
            documentSubtype: doc.head.subtype,
          },
        }),
      );
    } else {
      const newNumber = getNextDocNumber(receipts);
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: {
            number: newNumber,
            documentDate: new Date().toISOString(),
            status: 'DRAFT',
            toDepart: defaultDepart || undefined,
          },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepart]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!movementType) {
        alertWithSound('Внимание!', 'Тип документа для приходов не найден.');
        setScreenState('idle');
        return;
      }

      if (!(docNumber && docDate && docFromDepart && docToDepart)) {
        alertWithSound('Ошибка!', 'Не все поля заполнены.');
        setScreenState('idle');
        return;
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      if (!id) {
        const newDoc: IReceiptDocument = {
          id: docId,
          documentType: movementType,
          number: docNumber && docNumber.trim(),
          documentDate: docDate,
          status: 'DRAFT',
          head: {
            comment: docComment && docComment.trim(),
            fromDepart: docFromDepart,
            toDepart: docToDepart,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        navigation.dispatch(StackActions.replace('ReceiptView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');
          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IReceiptDocument = {
          ...doc,
          id,
          number: docNumber && docNumber.trim(),
          status: docStatus || 'DRAFT',
          documentDate: docDate,
          documentType: movementType,
          errorMessage: undefined,
          head: {
            ...doc.head,
            comment: docComment && docComment.trim(),
            fromDepart: docFromDepart,
            toDepart: docToDepart,
          },
          lines: doc.lines,
          creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };
        setScreenState('idle');
        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        navigation.navigate('ReceiptView', { id });
      }
    }
  }, [
    dispatch,
    doc,
    docComment,
    docDate,
    docFromDepart,
    docNumber,
    docStatus,
    docToDepart,
    id,
    movementType,
    navigation,
    screenState,
  ]);

  const renderRight = useCallback(
    () => <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />,
    [screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const isBlocked = docStatus !== 'DRAFT';

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (_event: any, selectedDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowDate(false);

    if (selectedDate) {
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: { documentDate: selectedDate.toISOString().slice(0, 10) },
        }),
      );
    }
  };

  const handlePresentDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowDate(true);
  };

  const handleFromDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      screenName,
      refName: 'depart',
      fieldName: 'fromDepart',
      value: docFromDepart && [docFromDepart],
      descrFieldName: 'shcode',
    });
  };

  const handleToDepart = () => {
    if (isBlocked) {
      return;
    }

    const params: Record<string, string> = {};

    navigation.navigate('SelectRefItem', {
      screenName,
      refName: 'depart',
      fieldName: 'toDepart',
      value: docToDepart && [docToDepart],
      descrFieldName: 'shcode',
      clause: params,
    });
  };

  const handleChangeNumber = useCallback(
    (text: string) =>
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: { number: text },
        }),
      ),
    [dispatch, screenName],
  );

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
        <SubTitle>{statusName}</SubTitle>
        <Divider />
        <ScrollView>
          <Input
            label="Номер"
            value={docNumber}
            onChangeText={handleChangeNumber}
            disabled={isBlocked}
            clearInput={true}
          />
          <SelectableInput
            label="Дата"
            value={getDateString(docDate || '')}
            onPress={handlePresentDate}
            disabled={docStatus !== 'DRAFT'}
          />
          <SelectableInput
            label={'Откуда'}
            value={docFromDepart?.name}
            onPress={handleFromDepart}
            disabled={isBlocked}
          />

          <SelectableInput label={'Куда'} value={docToDepart?.name} onPress={handleToDepart} disabled={isBlocked} />
          <Input
            label="Комментарий"
            value={docComment}
            onChangeText={(text) => {
              dispatch(
                appActions.setScreenFormParams({
                  screenName,
                  params: { comment: text || '' },
                }),
              );
            }}
            disabled={isBlocked}
            clearInput={true}
          />
        </ScrollView>
        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(docDate || '')}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleApplyDate}
          />
        )}
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};
