import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocumentType, IReference } from '@lib/types';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, useDispatch, documentActions, appActions, refSelectors, useSelector } from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  SelectableInput,
  Input,
  SaveButton,
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';

import { MovementStackParamList } from '../../navigation/Root/types';
import {
  IInventoryDocument,
  IDepartment,
  IInventoryFormParam,
  IMovementFormParam,
  IMovementDocument,
} from '../../store/types';

export const MovementEditScreen = () => {
  const id = useRoute<RouteProp<MovementStackParamList, 'MovementEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementEdit'>>();
  const dispatch = useDispatch();

  const formParams = useSelector((state) => state.app.formParams as IMovementFormParam);
  // const inventory = docSelectors.selectByDocType<IInventoryDocument>('inventory')?.find((e) => e.id === id);
  const inventory = docSelectors.selectByDocType<IMovementDocument>('inventory')?.find((e) => e.id === id);
  const docType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'inventory');

  const {
    departmentFrom: docDepartmentFrom,
    departmentTo: docDepartmentTo,
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

  const departmentFrom = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docDepartmentFrom?.id);

  const departmentTo = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docDepartmentTo?.id);

  useEffect(() => {
    if (!docDepartmentFrom) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['department']: departmentFrom?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDepartmentFrom]);

  useEffect(() => {
    // Инициализируем параметры
    if (inventory) {
      dispatch(
        appActions.setFormParams({
          number: inventory.number,
          documentType: inventory.documentType,
          documentDate: inventory.documentDate,
          comment: inventory.head.comment,
          departmentFrom: inventory.head.departmentFrom,
          departmentTo: inventory.head.departmentTo,
          status: inventory.status,
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
  }, [dispatch, inventory]);

  const handleSave = useCallback(() => {
    if (!docType) {
      return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден', [{ text: 'OK' }]);
    }
    if (!(docNumber && docDepartmentFrom && docDepartmentTo && docDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newInventory: IMovementDocument = {
        id: docId,
        documentType: docType,
        number: '1',
        documentDate: docDate,
        status: 'DRAFT',
        head: {
          comment: docComment,
          departmentFrom: docDepartmentFrom,
          departmentTo: docDepartmentTo,
        },
        lines: [],
        creationDate: createdDate,
        editionDate: createdDate,
      };

      dispatch(documentActions.addDocument(newInventory));

      navigation.dispatch(StackActions.replace('MovementView', { id: newInventory.id }));
    } else {
      if (!inventory) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedInventory: IMovementDocument = {
        ...inventory,
        id,
        number: docNumber as string,
        status: docStatus || 'DRAFT',
        documentDate: docDate,
        documentType: docType,
        errorMessage: undefined,
        head: {
          ...inventory.head,
          comment: docComment as string,
          departmentFrom: docDepartmentFrom,
          departmentTo: docDepartmentTo,
        },
        lines: inventory.lines,
        creationDate: inventory.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));
      navigation.navigate('MovementView', { id });
    }
  }, [
    docType,
    docNumber,
    docDepartmentFrom,
    docDepartmentTo,
    docDate,
    id,
    docComment,
    dispatch,
    navigation,
    inventory,
    docStatus,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
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
      fieldName: 'departmentFrom',
      value: docDepartmentFrom && [docDepartmentFrom],
    });
  };

  const handleNextDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'departmentTo',
      value: docDepartmentTo && [docDepartmentTo],
    });
  };

  console.log('depart', departmentFrom, 'doc', docDepartmentFrom);

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
          value={docDepartmentFrom?.name}
          onPress={handlePresentDepartment}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Куда"
          value={docDepartmentTo?.name}
          onPress={handleNextDepartment}
          disabled={isBlocked}
        />
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
