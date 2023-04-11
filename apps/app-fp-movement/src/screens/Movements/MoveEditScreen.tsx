import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SelectableInput, Input, SaveButton, SubTitle, AppScreen, navBackButton } from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-hooks';

import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { MoveStackParamList } from '../../navigation/Root/types';
import { IMoveFormParam, IMoveDocument } from '../../store/types';
import { getNextDocNumber } from '../../utils/helpers';

export const MoveEditScreen = () => {
  const id = useRoute<RouteProp<MoveStackParamList, 'MoveEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveEdit'>>();
  const dispatch = useDispatch();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const movements = useFilteredDocList<IMoveDocument>('movement');

  const doc = movements?.find((e) => e.id === id);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

  const movementType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'movement');

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    documentSubtype: docDocumentSubtype,
    fromDepart: docFromDepart,
    toDepart: docToDepart,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
  } = useSelector((state) => state.app.formParams as IMoveFormParam);

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
          documentSubtype: doc.head.subtype,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(movements);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          fromDepart: docDocumentSubtype?.id === 'internalMovement' ? defaultDepart : undefined,
          toDepart:
            docDocumentSubtype?.id === 'movement' || docDocumentSubtype?.id === 'prihod' ? defaultDepart : undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepart, docDocumentSubtype]);

  useEffect(() => {
    if (docDocumentSubtype?.id === 'cellMovement' && docFromDepart) {
      dispatch(
        appActions.setFormParams({
          toDepart: docFromDepart,
        }),
      );
    }
  }, [dispatch, docDocumentSubtype?.id, docFromDepart]);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!movementType) {
        Alert.alert('Внимание!', 'Тип документа для перемещений не найден.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (!docDocumentSubtype) {
        Alert.alert('Ошибка!', 'Не указан тип документа.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (
        (docDocumentSubtype?.id === 'internalMovement' && !docFromDepart) ||
        (docDocumentSubtype?.id === 'movement' && !docToDepart)
      ) {
        Alert.alert('Ошибка!', 'Нет подразделения пользователя. Обратитесь к администратору.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (docDocumentSubtype?.id === 'prihod' && docFromDepart?.isAddressStore) {
        Alert.alert('Ошибка!', 'В документе прихода подразделение "Откуда" не можнт быть адресным.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (!(docNumber && docDate && docFromDepart && docToDepart)) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
        setScreenState('idle');
        return;
      }

      if (
        (docDocumentSubtype?.id === 'internalMovement' || docDocumentSubtype?.id === 'movement') &&
        !docFromDepart.isAddressStore &&
        docToDepart.isAddressStore
      ) {
        Alert.alert('Ошибка!', 'Данные подразделения относятся к типу приход .', [{ text: 'OK' }]);
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
            subtype: docDocumentSubtype,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        navigation.dispatch(StackActions.replace('MoveView', { id: newDoc.id }));
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

            subtype: docDocumentSubtype,
          },
          lines: doc.lines,
          creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };
        setScreenState('idle');
        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        navigation.navigate('MoveView', { id });
      }
    }
  }, [
    dispatch,
    doc,
    docComment,
    docDate,
    docDocumentSubtype,
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
      dispatch(appActions.setFormParams({ documentDate: selectedDate.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowDate(true);
  };

  const handlePresentSubtype = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'documentSubtype',
      fieldName: 'documentSubtype',
      value: docDocumentSubtype && [docDocumentSubtype],
    });
  };

  const handleFromDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
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

    if (docDocumentSubtype?.id === 'cellMovement') {
      params.isAddressedStore = 'true';
    }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'toDepart',
      value: docToDepart && [docToDepart],
      descrFieldName: 'shcode',
      clause: params,
    });
  };

  const handleChangeNumber = useCallback(
    (text: string) => dispatch(appActions.setFormParams({ number: text })),
    [dispatch],
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
            label={'Тип'}
            value={docDocumentSubtype?.name}
            onPress={handlePresentSubtype}
            disabled={id ? true : isBlocked}
          />

          <SelectableInput
            label={'Откуда'}
            value={docFromDepart?.name}
            onPress={handleFromDepart}
            disabled={!docDocumentSubtype ? true : isBlocked}
          />

          <SelectableInput
            label={'Куда'}
            value={docDocumentSubtype?.id === 'cellMovement' ? docFromDepart?.name : docToDepart?.name}
            onPress={handleToDepart}
            disabled={!docDocumentSubtype ? true : isBlocked}
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
