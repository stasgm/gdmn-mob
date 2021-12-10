import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocumentType, IReference } from '@lib/types';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
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
  SelectableInput,
  Input,
  SaveButton,
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { IInventoryDocument, IDepartment, IInventoryFormParam } from '../../store/types';

export const InventoryEditScreen = () => {
  const id = useRoute<RouteProp<InventorysStackParamList, 'InventoryEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const formParams = useSelector((state) => state.app.formParams as IInventoryFormParam);
  const inventory = docSelectors.selectByDocType<IInventoryDocument>('inventory')?.find((e) => e.id === id);
  const docType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'inventory');

  const {
    department: docDepartment,
    onDate: docOnDate,
    documentDate: docInventoryDate,
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

  const department = refSelectors.selectByName<IDepartment>('contact')?.data?.find((e) => e.id === docDepartment?.id);

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
          onDate: inventory.head.onDate,
          documentDate: inventory.documentDate,
          comment: inventory.head.comment,
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

    if (!(docNumber && docDepartment && docOnDate && docInventoryDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;
    const newOntDate = new Date().toISOString();

    if (!id) {
      const newInventory: IInventoryDocument = {
        id: docId,
        documentType: docType,
        number: '1',
        documentDate: newOntDate,
        status: 'DRAFT',
        head: {
          comment: docComment,
          onDate: docOnDate,
          department: docDepartment,
        },
        lines: [],
        creationDate: newOntDate,
        editionDate: newOntDate,
      };

      docDispatch(documentActions.addDocument(newInventory));

      navigation.dispatch(StackActions.replace('InventoryView', { id: newInventory.id }));
    } else {
      if (!inventory) {
        return;
      }

      const updatedOrderDate = new Date().toISOString();

      const updatedInventory: IInventoryDocument = {
        ...inventory,
        id,
        number: docNumber as string,
        status: docStatus || 'DRAFT',
        documentType: docType,
        errorMessage: undefined,
        head: {
          ...inventory.head,
          comment: docComment,
          onDate: docOnDate,
          department: docDepartment,
        },
        lines: inventory.lines,
        creationDate: inventory.creationDate || updatedOrderDate,
        editionDate: updatedOrderDate,
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));
      navigation.navigate('InventoryView', { id });
    }
  }, [
    docNumber,
    docType,
    docDepartment,
    docComment,
    docOnDate,
    id,
    docDispatch,
    navigation,
    inventory,
    docInventoryDate,
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
      dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString().slice(0, 10) }));
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
      refName: 'contact',
      fieldName: 'department',
      value: docDepartment && [docDepartment],
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
          label="Подразделение"
          value={docDepartment?.name}
          onPress={handlePresentDepartment}
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