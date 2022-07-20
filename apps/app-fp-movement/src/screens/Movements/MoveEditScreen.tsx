import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider /*, useTheme*/ } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  SelectableInput,
  Input,
  SaveButton,
  SubTitle,
  AppScreen,
  RadioGroup,
  AppActivityIndicator,
} from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-app';

import { IDocumentType, IReference } from '@lib/types';

import { MoveStackParamList } from '../../navigation/Root/types';
import { IMoveFormParam, IMoveDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

export const MoveEditScreen = () => {
  const id = useRoute<RouteProp<MoveStackParamList, 'MoveEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<'idle' | 'saving'>('idle');

  const formParams = useSelector((state) => state.app.formParams as IMoveFormParam);

  const movements = useFilteredDocList<IMoveDocument>('move');

  const doc = movements?.find((e) => e.id === id);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const movementType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'move');

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    fromDepart: docFromDepart,
    toDepart: docToDepart,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
  } = useMemo(() => {
    return formParams;
  }, [formParams]);

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
          toDepart: doc.head.toDepart,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(movements);
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

  // const handleSave = useCallback(() => {
  useEffect(() => {
    if (screenState === 'saving') {
      if (!movementType) {
        Alert.alert('Внимание!', 'Тип документа для перемещений не найден.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }
      if (!docFromDepart) {
        Alert.alert('Ошибка!', 'Нет подразделения пользователя. Обратитесь к администратору.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (!(docNumber && docToDepart && docDate)) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      if (!id) {
        const newDoc: IMoveDocument = {
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

        navigation.dispatch(StackActions.replace('MoveView', { id: newDoc.id }));
        // setScreenState('idle');
      } else {
        if (!doc) {
          setScreenState('idle');
          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IMoveDocument = {
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

        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        navigation.navigate('MoveView', { id });
        // setScreenState('idle');
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
    () => (
      // <SaveButton onPress={handleSave} />,
      <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />
    ),
    [screenState],
  );

  console.log('state', screenState);
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
      dispatch(appActions.setFormParams({ documentDate: selectedDate.toISOString().slice(0, 10) }));
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
      refName: 'depart',
      fieldName: 'fromDepart',
      value: docFromDepart && [docFromDepart],
    });
  };

  const handleToDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'toDepart',
      value: docToDepart && [docToDepart],
      descrFieldName: 'shcode',
    });
  };

  const handleChangeStatus = useCallback(() => {
    dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
  }, [dispatch, docStatus]);

  const handleChangeNumber = useCallback((text) => dispatch(appActions.setFormParams({ number: text })), [dispatch]);

  const viewStyle = useMemo(
    () => [
      localStyles.switchContainer,
      localStyles.border,
      { borderColor: colors.primary, backgroundColor: colors.card },
    ],
    [colors.card, colors.primary],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
          <SelectableInput label={'Откуда'} value={docFromDepart?.name} onPress={handleFromDepart} disabled={true} />

          <SelectableInput label={'Куда'} value={docToDepart?.name} onPress={handleToDepart} disabled={isBlocked} />
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
