/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocument, IDocumentType, IReference, RefTypeChoose, SettingsDoc, SettingValueDoc } from '@lib/types';

import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import {
  useDispatch as useDocDispatch,
  docSelectors,
  useDispatch,
  documentActions,
  appActions,
  refSelectors,
  useSelector,
  settingsActions,
  IFormParam,
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

import { ConditionalRenderItem } from './СonditionalRenderItem';

export const InventoryEditScreen1 = () => {
  const id = useRoute<RouteProp<InventorysStackParamList, 'InventoryEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const formParams = useSelector((state) => state.app.formParams);
  //const storeSettings = useSelector((state) => state.settings);

  const documentTypeProps = 'inventory';

  const inventory = docSelectors.selectByDocType(documentTypeProps)?.find((e) => e.id === id);

  const docType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === documentTypeProps);

  const listRequisitesWithValuProps: SettingsDoc = {
    number: {
      id: '1',
      type: 'string',
      sortOrder: 1,
      description: 'Номер документа',
      clearInput: true,
      requeried: true,
      // onChangeText: 'onChangeText',
    },
    documentDate: {
      id: '2',
      type: 'date',
      sortOrder: 1,
      description: 'Дата',
      requeried: true,
    },
    department: {
      id: '3',
      type: 'ref',
      sortOrder: 1,
      description: 'Подразделение',
      refName: 'department',
      requeried: true,
    },
    comment: {
      id: '4',
      // name: 'comment',
      type: 'string',
      sortOrder: 2,
      description: 'Комментарий',
      clearInput: true,
      // onChangeText: 'onChangeText',
    },
  };

  const listRequisitesWithValue = useMemo(() => {
    console.log('listRequisitesWithValue');
    return formParams
      ? Object.entries(formParams).reduce((prev: SettingsDoc, cur) => {
          const key = cur[0];
          const param = listRequisitesWithValuProps[key];

          if (param) {
            console.log('form', cur);
            prev[key] = { ...param, value: cur[1] };
          }
          return prev;
        }, listRequisitesWithValuProps)
      : {};
  }, [formParams]);

  // const {
  //   department: docDepartment,
  //   onDate: docOnDate,
  //   documentDate: docInventoryDate,
  //   number: docNumber,
  //   comment: docComment,
  //   status: docStatus,
  // } = useMemo(() => {
  //   return formParams;
  // }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
  }, []);

  // const department = refSelectors.selectByName<IDepartment>('contact')?.data?.find((e) => e.id === docDepartment?.id);

  // useEffect(() => {
  //   if (!docDepartment) {
  //     dispatch(
  //       appActions.setFormParams({
  //         ...formParams,
  //         ['department']: department?.name,
  //       }),
  //     );
  //   }
  // }, [dispatch, docDepartment]);

  // useEffect(() => {
  //   dispatch(
  //     (listRequisitesWithValue = Object.entries(listRequisitesWithValue).reduce((prev: SettingsDoc, cur) => {
  //       const key = cur[0];
  //       const param = listRequisitesWithValue[key];
  //       if (param) {
  //         prev[key] = { ...param, disabled: isBlocked };
  //       }
  //       return prev;
  //     }, listRequisitesWithValue)),
  //   );
  // }, [dispatch, isBlocked]);

  useEffect(() => {
    // Инициализируем параметры
    if (inventory) {
      const formParam = Object.entries(listRequisitesWithValuProps).reduce((prev: IFormParam, cur) => {
        const key = cur[0];
        if (key === 'number' || key === 'documentDate') {
          prev[key] = inventory[key];
        } else {
          prev[key] = inventory.head ? inventory.head[key] : undefined;
        }

        return prev;
      }, {});

      dispatch(appActions.setFormParams(formParam));
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

  const docStatus = formParams?.status || 'DRAFT';
  console.log('docStatus', docStatus);
  const isBlocked = docStatus !== 'DRAFT';
  console.log('isBlocked', isBlocked);

  const handleSave = useCallback(() => {
    if (!docType) {
      return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден', [{ text: 'OK' }]);
    }
    // if (!(docNumber && docDepartment && docOnDate && docInventoryDate)) {
    //   return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    // }

    const docId = !id ? uuid() : id;
    const newDate = new Date().toISOString();

    if (!id) {
      const head = formParams
        ? Object.entries(formParams).reduce((prev: any, cur) => {
            const key = cur[0];
            if (key !== 'number' && key !== 'documentDate') {
              prev[key] = cur[1];
            }
            return prev;
          }, {})
        : {};

      const newInventory: IDocument = {
        id: docId,
        documentType: docType,
        number: '1',
        documentDate: newDate,
        status: 'DRAFT',
        head: head,
        lines: [],
        creationDate: newDate,
        editionDate: newDate,
      };

      docDispatch(documentActions.addDocument(newInventory));

      navigation.dispatch(StackActions.replace('InventoryView', { id: newInventory.id }));
    } else {
      if (!inventory) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedDocParams = formParams
        ? Object.entries(formParams).reduce((prev: any, cur) => {
            const key = cur[0];
            if (key === 'number' || key === 'documentDate') {
              prev[key] = cur[1];
            }
            return prev;
          }, {})
        : {};

      const updatedHeadParams = formParams
        ? Object.entries(formParams).reduce((prev: any, cur) => {
            const key = cur[0];
            if (key !== 'number' && key !== 'documentDate') {
              prev[key] = cur[1];
            }
            return prev;
          }, {})
        : {};

      const updatedInventory: IDocument = {
        ...inventory,
        id,
        ...updatedDocParams,
        head: {
          ...inventory.head,
          ...updatedHeadParams,
        },
        lines: inventory.lines,
        creationDate: inventory.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));
      navigation.navigate('InventoryView', { id });
    }
  }, [formParams, inventory]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  // Окно календаря для выбора даты.
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (_event: any, selectedDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату.
    setShowDate(false);

    if (selectedDate) {
      dispatch(appActions.setFormParams({ documentDate: selectedDate.toISOString().slice(0, 10) }));
    }
  };

  const [currentValue, setCurrentValue] = useState<any>();

  const handlePresentDate = (fieldName: string, value: any) => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    console.log('value', value);

    setCurrentValue(value);

    setShowDate(true);
  };

  const handlePress = (refType: RefTypeChoose, fieldName: string, refName: string, value: any) => {
    console.log('handlePress', refType, fieldName, value);
    switch (refType) {
      case 'date':
        handlePresentDate(fieldName, value);
        break;

      case 'ref':
        handlePresentReferrence(fieldName, refName, value);
        break;

      default:
        break;
    }
  };

  const handlePresentReferrence = (fieldName: string, refName: string, value: any) => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: refName,
      fieldName: fieldName,
      value: value && [value],
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

        {Object.entries(listRequisitesWithValue).map(([key, item]) => {
          //
          return (
            <ConditionalRenderItem
              key={key}
              type={item?.type || ''}
              value={item?.type === 'date' ? getDateString(item?.value || '') : item?.value}
              sortOrder={item?.sortOrder || 0}
              description={item?.description || ''}
              clearInput={item?.clearInput || true}
              disabled={item?.disabled}
              onChangeText={(text: string) => {
                dispatch(appActions.setFormParams({ [key]: text.trim() || '' }));
              }}
              onPress={() => handlePress(item!.type, key, item?.refName || '', item?.value)}
            />
          );
        })}
      </ScrollView>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(currentValue || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDate}
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
