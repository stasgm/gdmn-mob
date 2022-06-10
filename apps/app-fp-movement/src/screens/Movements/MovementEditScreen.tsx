import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider /*, useTheme*/ } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SelectableInput, Input, SaveButton, SubTitle, AppScreen, RadioGroup } from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors, docSelectors } from '@lib/store';

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocumentType, IReference } from '@lib/types';

import { MovementStackParamList } from '../../navigation/Root/types';
import { IMovementFormParam, IMovementDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

export const MovementEditScreen = () => {
  const id = useRoute<RouteProp<MovementStackParamList, 'MovementEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const formParams = useSelector((state) => state.app.formParams as IMovementFormParam);

  // const documents = useSelector((state) => state.documents.list) as IMovementDocument[];
  const movements = docSelectors.selectByDocType<IMovementDocument>('movement');
  const doc = movements?.find((e) => e.id === id);

  const movementType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'movement');

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
          // depart: defaultDepart,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc]);

  const handleSave = useCallback(() => {
    if (!movementType) {
      return Alert.alert('Внимание!', 'Тип документа для перемещений не найден.', [{ text: 'OK' }]);
    }

    if (!(docNumber && docFromDepart && docToDepart && docDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? generateId() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newDoc: IMovementDocument = {
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

      navigation.dispatch(StackActions.replace('MovementView', { id: newDoc.id }));
    } else {
      if (!doc) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedDoc: IMovementDocument = {
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
      navigation.navigate('MovementView', { id });
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
  ]);

  const renderRight = useCallback(() => <SaveButton onPress={handleSave} />, [handleSave]);

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

    // if (doc?.lines.length && documentType.remainsField === 'fromContact') {
    //   Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.fromDescription} при наличии позиций.`, [
    //     { text: 'OK' },
    //   ]);
    //   return;
    // }

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

    // if (doc?.lines.length && documentType.remainsField === 'toContact') {
    //   Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.toDescription} при наличии позиций.`, [
    //     { text: 'OK' },
    //   ]);
    //   return;
    // }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'toDepart',
      value: docToDepart && [docToDepart],
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
