/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocument, IDocumentType, IReference, RefTypeChoose } from '@lib/types';

import {
  docSelectors,
  useDispatch,
  documentActions,
  appActions,
  refSelectors,
  useSelector,
  IFormParam,
} from '@lib/store';
import { BackButton, AppInputScreen, SaveButton, globalStyles as styles, SubTitle } from '@lib/mobile-ui';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { MetaData } from '../../store/types';

import { metaData } from '../../utils/constants';

import { ConditionalRenderItem } from './СonditionalRenderItem';

export const InventoryEditScreen2 = (props: any) => {
  const { params } = props.route;
  const documentTypeProps = params?.docType as string;

  const id = useRoute<RouteProp<InventorysStackParamList, 'InventoryEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryEdit'>>();
  const dispatch = useDispatch();

  const formParams = useSelector((state) => state.app.formParams);
  const inventory = docSelectors.selectByDocType(documentTypeProps)?.find((e) => e.id === id);

  const docTypeEdit = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === documentTypeProps);

  const valuesList = metaData;
  const listRequisitesWithValuProps: any = Object.entries(
    valuesList.find((item) => {
      return Object.entries(item).find((i) => i[0] === documentTypeProps);
    }),
  ).map((item) => {
    return item[1];
  })[0];
  /// убрать
  const listRequisitesWithValue = useMemo(() => {
    return formParams
      ? Object.entries(formParams).reduce((prev: MetaData, cur) => {
          const key = cur[0];
          const param = listRequisitesWithValuProps[key];

          if (param) {
            prev[key] = { ...param, value: cur[1] };
          }
          return prev;
        }, listRequisitesWithValuProps)
      : {};
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
  }, []);

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

  const docStatus = (formParams?.status as string) || 'DRAFT';

  const isBlocked = docStatus !== 'DRAFT';

  const handleSave = useCallback(() => {
    if (!docTypeEdit) {
      return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден', [{ text: 'OK' }]);
    }
    //////
    //Проверка обязат реквизитов
    //////
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
        documentType: docTypeEdit,
        number: '1',
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: head,
        lines: [],
        creationDate: newDate,
        editionDate: newDate,
      };

      dispatch(documentActions.addDocument(newInventory));
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

      dispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));

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

    setCurrentValue(value);

    setShowDate(true);
  };

  const handlePress = (refType: RefTypeChoose, fieldName: string, refName: string, value: any) => {
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
          return (
            <ConditionalRenderItem
              key={key}
              description={item?.description}
              item={item?.value} // из formparams
              type={(item?.type && item?.type) || ''}
              disabled={isBlocked}
              clearInput={item?.clearInput || true}
              onChangeText={(text: string) => {
                dispatch(appActions.setFormParams({ [key]: text.trim() || '' }));
              }}
              onPress={() => handlePress(item?.type as 'string', key, item?.refName as string, item?.value)}
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
