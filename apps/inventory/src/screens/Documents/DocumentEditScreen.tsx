import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import {
  docSelectors,
  documentActions,
  refSelectors,
  useDispatch as useDocDispatch,
  useSelector,
  appActions,
  useDispatch,
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
import { IDepartment, IInventoryDocument } from '../../store/types';

import { getDateString } from '../../utils/helpers';
import { IInventoryFormParam} from '../../store/app/types';

export const DocumentEditScreen = () => {
  const id = useRoute<RouteProp<DocumentsStackParamList, 'DocumentEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<DocumentsStackParamList, 'DocumentEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const formParams = useSelector((state) => state.app.formParams as IInventoryFormParam);

  const inventory = docSelectors.selectByDocType<IInventoryDocument>('inventory')?.find((e) => e.id === id);

  const {
    contact: docContact,
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
    if (!docContact && !!docDepartment) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['department']: department?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDepartment, department?.name]);

  useEffect(() => {
    if (!!docContact && !!docDepart) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['depart']: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docContact?.id, docDepart?.name]);

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
          contact: inventory.head.contact,
          documentType: inventory.documentType,
          comment: inventory.head.comment,
          onDate: inventory.head.onDate,
          department: inventory.head.department,
          documentDate: inventory.documentDate,
          status: inventory.status,
          depart: inventory.head.depart,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          documentDate: new Date().toISOString(),
          onDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, inventory]);

  const handleSave = useCallback(() => {
    if (!(docNumber && docType && docContact && docDepartment && docOnDate)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    const newOrderDate = new Date().toISOString();

    if (!id) {
      const newInventory: IInventoryDocument = {
        id: docId,
        number: docNumber,
        documentDate: newOrderDate,
        status: 'DRAFT',
        documentType: docType,
        head: {
          contact: docContact,
          comment: docComment,
          onDate: docOnDate,
          department: docDepartment,
          depart: docDepart,
        },
        lines: [],
        creationDate: newOrderDate,
        editionDate: newOrderDate,
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
        //documentDate: docDocumentDate,
        errorMessage: undefined,
        documentType: docType,
        comment: docComment,
        head: {
          ...inventory.head,
          contact: docContact,
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
    docContact,
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

  const handlePresentContact = () => {
    if (isBlocked) {
      return;
    }

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

    //TODO: если изменился контакт, то и магазин должен обнулиться
    const params: Record<string, string> = {};

    /* if (docContact?.id) {
      params.companyId = docContact?.id;
    } */

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

  /* const handlePresentDocComment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'comment',
      fieldName: 'docComment',
      value: docComment && [docComment],
    });
  }; */

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
                // disabled={isBlocked}
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
        {/* <SelectableInput
          label="Организация"
          placeholder="Выберите покупателя..."
          value={docContact?.name}
          onPress={handlePresentContact}
          disabled={isBlocked}
        /> */}
        <SelectableInput
          label="Подразделение"
          value={docDepartment?.name}
          onPress={handlePresentDepartment}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Контрагенты"
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

export default DocumentEditScreen;

const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
  },
});
