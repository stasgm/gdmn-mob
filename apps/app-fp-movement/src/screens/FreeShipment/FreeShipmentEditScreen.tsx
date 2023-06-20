import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SelectableInput, Input, SaveButton, SubTitle, AppScreen, RadioGroup, navBackButton } from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-hooks';

import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { CurrFreeShipmentStackParamList, FreeShipmentStackParamList } from '../../navigation/Root/types';
import { IFreeShipmentFormParam, IFreeShipmentDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';

export const FreeShipmentEditScreen = () => {
  const { id, isCurr } = useRoute<RouteProp<FreeShipmentStackParamList, 'FreeShipmentEdit'>>().params;

  const navigation = useNavigation<StackNavigationProp<FreeShipmentStackParamList, 'FreeShipmentEdit'>>();
  const navigationCurr = useNavigation<StackNavigationProp<CurrFreeShipmentStackParamList, 'FreeShipmentEdit'>>();

  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const shipments = useFilteredDocList<IFreeShipmentDocument>('freeShipment');

  const doc = shipments?.find((e) => e.id === id);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const shipmentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => (isCurr ? t.name === 'currFreeShipment' : t.name === 'freeShipment'));

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    fromDepart: docFromDepart,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
  } = useSelector((state) => state.app.formParams as IFreeShipmentFormParam);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Инициализируем параметры
    if (doc) {
      dispatch(
        appActions.setFormParams({
          number: doc.number,
          documentDate: doc.documentDate,
          status: doc.status,
          comment: doc.head.comment,
          fromDepart: doc.head.fromDepart,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(shipments);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          fromDepart: defaultDepart,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepart]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!shipmentType) {
        Alert.alert('Внимание!', 'Тип документа для заявок не найден.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }
      if (!docFromDepart) {
        Alert.alert('Ошибка!', 'Нет подразделения пользователя. Обратитесь к администратору.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (!(docNumber && docFromDepart && docDate)) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      if (!id) {
        const newDoc: IFreeShipmentDocument = {
          id: docId,
          documentType: shipmentType,
          number: docNumber && docNumber.trim(),
          documentDate: docDate,
          status: 'DRAFT',
          head: {
            comment: docComment && docComment.trim(),
            fromDepart: docFromDepart,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        isCurr
          ? navigationCurr.dispatch(StackActions.replace('FreeShipmentView', { id: newDoc.id }))
          : navigation.dispatch(StackActions.replace('FreeShipmentView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');
          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IFreeShipmentDocument = {
          ...doc,
          id,
          number: docNumber && docNumber.trim(),
          status: docStatus || 'DRAFT',
          documentDate: docDate,
          documentType: shipmentType,
          errorMessage: undefined,
          head: {
            ...doc.head,
            comment: docComment && docComment.trim(),
            fromDepart: docFromDepart,
          },
          lines: doc.lines,
          creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        setScreenState('idle');
        isCurr
          ? navigationCurr.navigate('FreeShipmentView', { id, isCurr })
          : navigation.navigate('FreeShipmentView', { id, isCurr });
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
    id,
    isCurr,
    navigation,
    navigationCurr,
    screenState,
    shipmentType,
  ]);

  const renderRight = useCallback(
    () => <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />,
    [screenState],
  );

  useLayoutEffect(() => {
    const options = {
      headerLeft: navBackButton,
      headerRight: renderRight,
    };
    isCurr ? navigationCurr.setOptions(options) : navigation.setOptions(options);
  }, [isCurr, navigation, navigationCurr, renderRight]);

  const isBlocked = docStatus !== 'DRAFT';

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (_event: any, selectedDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowDate(false);

    if (selectedDate) {
      dispatch(appActions.setFormParams({ documentDate: selectedDate.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowDate(true);
  };

  const handleDepart = () => {
    if (isBlocked) {
      return;
    }

    const options = {
      refName: 'depart',
      fieldName: 'fromDepart',
      value: docFromDepart && [docFromDepart],
    };

    isCurr ? navigationCurr.navigate('SelectRefItem', options) : navigation.navigate('SelectRefItem', options);
  };

  const handleChangeStatus = useCallback(() => {
    dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
  }, [dispatch, docStatus]);

  const handleChangeNumber = useCallback(
    (text: string) => dispatch(appActions.setFormParams({ number: text })),
    [dispatch],
  );

  const viewStyle = useMemo(
    () => [
      localStyles.switchContainer,
      localStyles.border,
      { borderColor: colors.primary, backgroundColor: colors.card },
    ],
    [colors.card, colors.primary],
  );

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
        <SubTitle>{statusName}</SubTitle>
        <Divider />
        <ScrollView>
          <View style={viewStyle}>
            <RadioGroup
              options={STATUS_LIST}
              onChange={handleChangeStatus}
              activeButtonId={STATUS_LIST.find((i) => i.id === docStatus)?.id}
              directionRow={true}
            />
          </View>
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
            label={'Подразделение'}
            value={docFromDepart?.name}
            onPress={handleDepart}
            disabled={isBlocked}
          />

          <Input
            label="Комментарий"
            value={docComment}
            onChangeText={(text) => {
              dispatch(appActions.setFormParams({ comment: text || '' }));
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

export const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
    paddingLeft: 5,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
});
