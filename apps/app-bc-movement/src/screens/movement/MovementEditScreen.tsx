import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocumentType, IReference } from '@lib/types';
import { docSelectors, useDispatch, documentActions, appActions, refSelectors, useSelector } from '@lib/store';
import {
  AppInputScreen,
  SelectableInput,
  Input,
  SaveButton,
  globalStyles as styles,
  SubTitle,
  navBackButton,
} from '@lib/mobile-ui';

import { generateId, getDateString } from '@lib/mobile-hooks';

import { MovementStackParamList } from '../../navigation/Root/types';
import { IDepartment, IMovementFormParam, IMovementDocument } from '../../store/types';

export const MovementEditScreen = () => {
  const id = useRoute<RouteProp<MovementStackParamList, 'MovementEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementEdit'>>();
  const dispatch = useDispatch();

  const {
    fromPlace: docFromPlace,
    toPlace: docToPlace,
    documentDate: docDate,
    number: docNumber,
    status: docStatus,
  } = useSelector((state) => state.app.formParams as IMovementFormParam);

  const bcMovement = docSelectors.selectByDocId<IMovementDocument>(id);
  const docType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'bcMovement');

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fromPlace = refSelectors.selectByName<IDepartment>('department')?.data?.find((e) => e.id === docFromPlace?.id);

  const toPlace = refSelectors.selectByName<IDepartment>('department')?.data?.find((e) => e.id === docToPlace?.id);

  useEffect(() => {
    if (!docFromPlace) {
      dispatch(
        appActions.setFormParams({
          department: fromPlace?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docFromPlace]);

  useEffect(() => {
    if (!docToPlace) {
      dispatch(
        appActions.setFormParams({
          department: toPlace?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docFromPlace]);

  useEffect(() => {
    // Инициализируем параметры
    if (bcMovement) {
      dispatch(
        appActions.setFormParams({
          number: bcMovement.number,
          documentType: bcMovement.documentType,
          documentDate: bcMovement.documentDate,
          fromPlace: bcMovement.head.fromPlace,
          toPlace: bcMovement.head.toPlace,
          status: bcMovement.status,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, bcMovement]);

  const handleSave = useCallback(() => {
    if (!docType) {
      return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден.', [{ text: 'OK' }]);
    }
    if (!(docNumber && docFromPlace && docToPlace && docDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? generateId() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newBcMovement: IMovementDocument = {
        id: docId,
        documentType: docType,
        number: '1',
        documentDate: docDate,
        status: 'DRAFT',
        head: {
          fromPlace: docFromPlace,
          toPlace: docToPlace,
        },
        lines: [],
        creationDate: createdDate,
        editionDate: createdDate,
      };

      dispatch(documentActions.addDocument(newBcMovement));

      navigation.dispatch(StackActions.replace('MovementView', { id: newBcMovement.id }));
    } else {
      if (!bcMovement) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedBcMovement: IMovementDocument = {
        ...bcMovement,
        id,
        number: docNumber as string,
        status: docStatus || 'DRAFT',
        documentDate: docDate,
        documentType: docType,
        errorMessage: undefined,
        head: {
          ...bcMovement.head,
          fromPlace: docFromPlace,
          toPlace: docToPlace,
        },
        lines: bcMovement.lines,
        creationDate: bcMovement.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedBcMovement }));
      navigation.navigate('MovementView', { id });
    }
  }, [docType, docNumber, docFromPlace, docToPlace, docDate, id, dispatch, navigation, bcMovement, docStatus]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const isBlocked = docStatus !== 'DRAFT';

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты.
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату.
    setShowOnDate(false);

    if (selectedOnDate) {
      dispatch(appActions.setFormParams({ documentDate: selectedOnDate.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentOnDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowOnDate(true);
  };

  const handlePresentDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'fromPlace',
      value: docFromPlace && [docFromPlace],
    });
  };

  const handleNextDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'toPlace',
      value: docToPlace && [docToPlace],
    });
  };

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView>
        {['DRAFT', 'READY'].includes(docStatus || 'DRAFT') && (
          <>
            <View style={[styles.directionRow, localStyles.switchContainer]}>
              <Text>Черновик:</Text>
              <Switch
                value={docStatus === 'DRAFT' || !docStatus}
                onValueChange={() => {
                  dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
                }}
              />
            </View>
          </>
        )}

        <Input
          label="Номер документа"
          value={docNumber}
          onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
          disabled={isBlocked}
          clearInput={true}
        />

        <SelectableInput
          label="Дата"
          value={getDateString(docDate || '')}
          onPress={handlePresentOnDate}
          disabled={docStatus !== 'DRAFT'}
        />

        <SelectableInput
          label="Откуда"
          value={docFromPlace?.name}
          onPress={handlePresentDepartment}
          disabled={isBlocked}
        />
        <SelectableInput label="Куда" value={docToPlace?.name} onPress={handleNextDepartment} disabled={isBlocked} />
      </ScrollView>
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docDate || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDate}
        />
      )}
    </AppInputScreen>
  );
};

export const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
  },
});
