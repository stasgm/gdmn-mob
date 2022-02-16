import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { FieldType, IDocument, IDocumentType, IReference } from '@lib/types';
import { useDispatch, documentActions, appActions, useSelector, IFormParam, refSelectors } from '@lib/store';
import { BackButton, AppInputScreen, SaveButton, globalStyles as styles, SubTitle } from '@lib/mobile-ui';

import { DocStackParamList } from '../../navigation/Root/types';
import { defaultHeadFields, documentTypes } from '../../utils/constants';
import InputItem from '../../components/InputItem';

export const DocEditScreen = () => {
  const { id, type } = useRoute<RouteProp<DocStackParamList, 'DocEdit'>>().params;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocEdit'>>();
  const dispatch = useDispatch();

  const formParams = useSelector((state) => state.app.formParams);
  const doc = useSelector((state) => state.documents.list.find((e) => e.id === id)); //docSelectors.selectByDocType<IInventoryDocument>(type)?.find((e) => e.id === id);

  const docType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === type);

  //TODO: Брать из хранилища
  const headFields = useMemo(() => documentTypes.find((t) => t.name === type)?.metadata?.head || {}, [type]);
  //Все поля шапки документа
  const docFields = useMemo(() => ({ ...headFields, ...defaultHeadFields }), [headFields]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Инициализируем параметры
    if (doc) {
      //Поля шапки по умолчанию со значениями из документа
      const defaultFormParam = Object.keys(defaultHeadFields).reduce((prev: IFormParam, key: string) => {
        prev[key] = doc[key];
        return prev;
      }, {});
      //Поля шапки из настроек со значениями из документа
      const headFormParam = Object.keys(headFields).reduce((prev: IFormParam, key: string) => {
        prev[key] = doc.head && doc.head[key];
        return prev;
      }, {});

      dispatch(appActions.setFormParams({ ...defaultFormParam, ...headFormParam }));
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          documentDate: new Date().toISOString(),
          documentType: docType,
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, doc, docType, headFields]);

  const docStatus = formParams?.status || 'DRAFT';

  const isBlocked = docStatus !== 'DRAFT';

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  //Для компонента выбора даты
  const [showDate, setShowDate] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>();
  const [dateFieldName, setDateFieldName] = useState<string | undefined>();

  const handleApplyDate = (_event: any, selectedDate: Date | undefined) => {
    //Закрываем календарь и записываем выбранную дату
    setShowDate(false);

    if (selectedDate && dateFieldName) {
      dispatch(appActions.setFormParams({ [dateFieldName]: selectedDate.toISOString().slice(0, 10) }));
    }
  };

  const handleSave = useCallback(() => {
    if (!docType) {
      return Alert.alert('Ошибка!', 'Тип документа не найден', [{ text: 'OK' }]);
    }

    if (!formParams) {
      return;
    }

    const isNotAllFieldsFilled =
      Object.entries(docFields).filter(([key, field]) => field?.required && !formParams[key]).length > 0;

    if (isNotAllFieldsFilled) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;
    const createdDate = new Date().toISOString();

    //Поля шапки по умолчанию со значениями из формы
    const defaultFields = Object.entries(formParams).reduce((prev: any, [key, value]) => {
      if (key in defaultHeadFields) {
        prev[key] = value;
      }
      return prev;
    }, {});

    //Поля шапки из настроек со значениями из формы
    const head = Object.entries(formParams).reduce((prev: any, [key, value]) => {
      if (key in headFields) {
        prev[key] = value;
      }
      return prev;
    }, {});

    if (!id) {
      const newDoc: IDocument = {
        id: docId,
        ...defaultFields,
        head,
        lines: [],
        creationDate: createdDate,
        editionDate: createdDate,
      };

      dispatch(documentActions.addDocument(newDoc));
      navigation.dispatch(StackActions.replace('DocView', { id: newDoc.id }));
    } else {
      if (!doc) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedDoc: IDocument = {
        ...doc,
        id,
        status: docStatus,
        ...defaultFields,
        head: {
          ...doc.head,
          ...head,
        },
        lines: doc.lines,
        creationDate: doc.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
      navigation.navigate('DocView', { id, type });
    }
  }, [docType, formParams, docFields, id, headFields, dispatch, navigation, doc, docStatus, type]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const handlePresentDate = (fieldName: string, value: Date | undefined) => {
    if (isBlocked) {
      return;
    }

    setDateFieldName(fieldName);
    setDateValue(value);
    setShowDate(true);
  };

  const handlePress = (refType: FieldType, fieldName: string, refName: string, value: any) => {
    switch (refType) {
      case 'date':
        handlePresentDate(fieldName, value);
        break;

      case 'ref':
        handlePresentRef(fieldName, refName, value);
        break;

      case 'boolean':
        dispatch(
          appActions.setFormParams({
            [fieldName]: fieldName === 'status' ? (docStatus === 'DRAFT' ? 'READY' : 'DRAFT') : !value,
          }),
        );
        break;

      default:
        break;
    }
  };

  const handlePresentRef = (fieldName: string, refName: string, value: any) => {
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

        {Object.entries(docFields)
          .filter(([_key, item]) => item.visible !== false)
          .sort((f1, f2) => (f1[1].sortOrder || 100) - (f2[1].sortOrder || 100))
          .map(([key, item]) => {
            const inputValue = formParams && formParams[key];
            return (
              <InputItem
                key={key}
                description={item.description}
                value={inputValue}
                type={item.type}
                disabled={isBlocked}
                clearInput={!!item.clearInput && !isBlocked}
                onChangeText={(text: string) => {
                  dispatch(appActions.setFormParams({ [key]: text.trim() || '' }));
                }}
                onPress={() => handlePress(item.type, key, item.refName || '', inputValue)}
              />
            );
          })}
      </ScrollView>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateValue ? new Date(dateValue) : new Date()}
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
