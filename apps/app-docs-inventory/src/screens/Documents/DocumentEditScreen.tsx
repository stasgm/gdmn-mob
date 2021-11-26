/* eslint-disable import/no-duplicates */
/* eslint-disable no-undef */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { v4 as uuid } from 'uuid';

import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  useDispatch as useDocDispatch,
  docSelectors,
  useDispatch,
  documentActions,
  appActions,
  refSelectors,
  useSelector,
} from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  Input,
  SelectableInput,
  SaveButton,
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';

import { DocumentsStackParamList } from '../../navigation/Root/types';
import { IInventoryFormParam } from '../../store/app/types';
import { IInventoryDocument, IDepartment } from '../../store/types';

export const DocumentEditScreen = () => {
  const id = useRoute<RouteProp<DocumentsStackParamList, 'DocumentEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<DocumentsStackParamList, 'DocumentEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const formParams = useSelector((state) => state.app.formParams as IInventoryFormParam);

  const inventory = docSelectors.selectByDocType<IInventoryDocument>('inventory')?.find((e) => e.id === id);

  const {
    documentType: docType,
    department: docDepartment,
    depart: docDepart,
    number: docNumber,
    onDate: docOnDate,
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

  const department = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docDepartment?.id);

  useEffect(() => {
    if (!docDepartment) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['department']: department?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDepartment]);

  useEffect(() => {
    if (!docDepart) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['depart']: depart?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDepart]);

  useEffect(() => {
    if (!docType) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['documentType']: docType,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docType]);

  useEffect(() => {
    if (!docComment) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['comment']: docComment,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docComment]);

  useEffect(() => {
    // Инициализируем параметры
    if (inventory) {
      dispatch(
        appActions.setFormParams({
          number: inventory.number,
          documentType: inventory.documentType,
          comment: inventory.head.comment,
          onDate: inventory.head.onDate,
          department: inventory.head.department,
          status: inventory.status,
          depart: inventory.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          onDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, inventory]);

  const handleSave = useCallback(() => {
    if (!(docNumber && docType && docDepart && docDepartment && docOnDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    const newDocumentDate = new Date().toISOString();

    if (!id) {
      const newInventory: IInventoryDocument = {
        id: docId,
        number: docNumber,
        status: 'DRAFT',
        documentType: docType,
        head: {
          comment: docComment,
          onDate: newDocumentDate,
          department: docDepartment,
          depart: docDepart,
        },
        lines: [],
        creationDate: newDocumentDate,
        editionDate: newDocumentDate,
      };

      docDispatch(documentActions.addDocument(newInventory));

      navigation.dispatch(StackActions.replace('DocumentView', { id: newInventory.id }));
    } else {
      if (!inventory) {
        return;
      }

      const updatedOrderDate = new Date().toISOString();

      const updatedInventory: IInventoryDocument = {
        ...inventory,
        id,
        number: docNumber,
        status: docStatus || 'DRAFT',
        errorMessage: undefined,
        documentType: docType,
        comment: docComment,
        head: {
          ...inventory.head,
          onDate: docOnDate,
          comment: docComment,
          department: docDepartment,
          depart: docDepart,
        },
        lines: inventory.lines,
        creationDate: inventory.creationDate || updatedOrderDate,
        editionDate: updatedOrderDate,
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));
      navigation.navigate('DocumentView', { id });
    }
  }, [
    docType,
    docNumber,
    docDepartment,
    docOnDate,
    docComment,
    id,
    docDispatch,
    navigation,
    inventory,
    docStatus,
    docDepart,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const isBlocked = docStatus !== 'DRAFT';

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты
  const [showOnDate, setShowOnDate] = useState(false);

  const handleApplyOnDate = (_event: any, selectedOnDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowOnDate(false);

    if (selectedOnDate) {
      dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentOnDate = () => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowOnDate(true);
  };

    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact && [docContact],
    });
  };

  const handlePresentDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'department',
      clause: params,
      value: docDepartment && [docDepartment],
    });
  };

  const handlePresentDepart = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'depart',
      fieldName: 'docDepart',
      value: docDepart && [docDepart],
    });
  };

  const handlePresentDocType = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'documentType',
      fieldName: 'docType',
      value: docType && [docType],
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
        />
        <SelectableInput
          label="Дата"
          value={getDateString(docOnDate || '')}
          onPress={handlePresentOnDate}
          disabled={docStatus !== 'DRAFT'}
        />
        <SelectableInput
          label="Тип документа"
          placeholder="Выберите тип документа..."
          value={docType?.name}
          onPress={handlePresentDocType}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Подразделение"
          value={docDepartment?.name}
          onPress={handlePresentDepartment}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Организации"
          value={docDepart?.name}
          onPress={handlePresentDepart}
          disabled={isBlocked}
        />
        <Input
          label="Комментарий"
          value={docComment}
          onChangeText={(text) => dispatch(appActions.setFormParams({ string: text.trim() }))}
          disabled={isBlocked}
        />
      </ScrollView>
      {showOnDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docOnDate || '')}
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
