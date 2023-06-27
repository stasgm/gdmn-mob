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

import { DashboardStackParamList } from '@lib/mobile-navigation';

import { ReturnStackParamList } from '../../navigation/Root/types';
import { IReturnFormParam, IReturnDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';

export const ReturnEditScreen = () => {
  const id = useRoute<RouteProp<ReturnStackParamList, 'ReturnEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnStackParamList & DashboardStackParamList, 'ReturnEdit'>>();
  const dispatch = useDispatch();
  const navState = navigation.getState();
  const screenName = navState.routes.some((route) => route.name === 'Dashboard')
    ? 'ReturnEditScreenDashboard'
    : 'ReturnEditScreen';

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const shipments = useFilteredDocList<IReturnDocument>('return');

  const doc = shipments?.find((e) => e.id === id);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const shipmentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'return');

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const forms = useSelector((state) => state.app.screenFormParams);
  const {
    fromDepart: docFromDepart,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
  } = (forms && forms[screenName] ? forms[screenName] : {}) as IReturnFormParam;

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
          },
        }),
      );
    } else {
      const newNumber = getNextDocNumber(shipments);
      dispatch(
        appActions.setScreenFormParams({
          screenName,
          params: {
            number: newNumber,
            documentDate: new Date().toISOString(),
            status: 'DRAFT',
            fromDepart: defaultDepart,
          },
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepart]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!shipmentType) {
        Alert.alert('Внимание!', 'Тип документа для возвратов не найден.', [{ text: 'OK' }]);
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
        const newDoc: IReturnDocument = {
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

        navigation.dispatch(StackActions.replace('ReturnView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');
          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IReturnDocument = {
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
        navigation.navigate('ReturnView', { id });
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
    navigation,
    screenState,
    shipmentType,
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

  const handleDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      screenName,
      refName: 'depart',
      fieldName: 'fromDepart',
      value: docFromDepart && [docFromDepart],
    });
  };

  const handleChangeStatus = useCallback(() => {
    dispatch(
      appActions.setScreenFormParams({
        screenName,
        params: { status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' },
      }),
    );
  }, [dispatch, docStatus, screenName]);

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
