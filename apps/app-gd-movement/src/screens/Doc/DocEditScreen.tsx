import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocumentType, IReference } from '@lib/types';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { useDispatch, documentActions, appActions, refSelectors, useSelector } from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  SelectableInput,
  Input,
  SaveButton,
  globalStyles as styles,
  SubTitle,
  BottomSheet,
  RadioGroup,
  MenuItem,
} from '@lib/mobile-ui';

import { IListItem } from '@lib/mobile-types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IDepartment, IDocFormParam, IDocDocument } from '../../store/types';
import { contactTypes, getNextDocNumber } from '../../utils/constants';

export const DocEditScreen = () => {
  const id = useRoute<RouteProp<DocStackParamList, 'DocEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const formParams = useSelector((state) => state.app.formParams as IDocFormParam);

  const documents = useSelector((state) => state.documents.list) as IDocDocument[];

  const newNumber = getNextDocNumber(documents);

  const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IDocDocument | undefined;

  const {
    documentType: docDocumentType,
    fromContact: docFromContact,
    toContact: docToContact,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
    fromContactType: docFromContactType,
    toContactType: docToContactType,
  } = useMemo(() => {
    return formParams;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;
  const documentType = useMemo(() => {
    return documentTypes?.find((e) => e.id === docDocumentType?.id);
  }, [docDocumentType?.id, documentTypes]);
  // const documentType = refSelectors
  //   .selectByName<IDocumentType>('documentType')
  //   ?.data?.find((e) => e.id === docDocumentType?.id);

  // useEffect(() => {
  //   if (!docDocumentType) {
  //     dispatch(appActions.setFormParams({ documentType: documentType }));
  //   }
  // }, [dispatch, docDocumentType, documentType]);

  const fromContactType = contactTypes.find((e) => e.id === docFromContactType?.id);
  const toContactType = contactTypes.find((e) => e.id === docToContactType?.id);

  useEffect(() => {
    // Инициализируем параметры
    if (doc) {
      dispatch(
        appActions.setFormParams({
          number: doc.number,
          documentType: doc.documentType,
          documentDate: doc.documentDate,
          comment: doc.head.comment,
          fromContact: doc.head.fromContact,
          toContact: doc.head.toContact,
          status: doc.status,
          fromContactType: doc.head.fromContactType,
          toContactType: doc.head.toContactType,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: newNumber, //'1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          // fromContactType: contactTypes[0],
          fromContactType: contactTypes.find((item) => item.id === documentType?.fromType),
          toContactType: contactTypes.find((item) => item.id === documentType?.toType),
          // toContactType: contactTypes[0],
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, newNumber]);

  const handleSave = useCallback(() => {
    if (documentType?.fromRequired && !(docNumber && docDate && docDocumentType && docFromContact)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }
    if (documentType?.toRequired && !(docNumber && docDate && docDocumentType && docToContact)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    if (
      documentType?.isRemains &&
      docDate &&
      new Date(docDate).toLocaleDateString() < new Date().toLocaleDateString()
    ) {
      Alert.alert('Ошибка!', 'Нельзя выбрать дату меньше текущей.', [{ text: 'OK' }]);
      return;
    }
    const docId = !id ? uuid() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newDoc: IDocDocument = {
        id: docId,
        documentType: docDocumentType,
        number: newNumber,
        documentDate: docDate,
        status: 'DRAFT',
        head: {
          comment: docComment,
          fromContact: docFromContact,
          toContact: docToContact,
          fromContactType: docFromContactType,
          toContactType: docToContactType,
        },
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

      const updatedDoc: IDocDocument = {
        ...doc,
        id,
        number: docNumber as string,
        status: docStatus || 'DRAFT',
        documentDate: docDate,
        documentType: docDocumentType,
        errorMessage: undefined,
        head: {
          ...doc.head,
          comment: docComment as string,
          fromContact: docFromContact,
          toContact: docToContact,
          fromContactType: docFromContactType,
          toContactType: docToContactType,
        },
        lines: doc.lines,
        creationDate: doc.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
      navigation.navigate('DocView', { id });
    }
  }, [
    documentType?.fromRequired,
    documentType?.toRequired,
    documentType?.isRemains,
    docNumber,
    docDate,
    docDocumentType,
    docFromContact,
    docToContact,
    id,
    newNumber,
    docComment,
    docFromContactType,
    docToContactType,
    dispatch,
    navigation,
    doc,
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

  const handleFromContact = () => {
    if (isBlocked) {
      return;
    }

    if (doc?.lines.length && documentType?.remainsField === 'fromContact') {
      Alert.alert('Ошибка!', 'Нельзя изменить контакт при наличии позиций.', [{ text: 'OK' }]);
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(fromContactType?.id),
      fieldName: 'fromContact',
      value: docFromContact && [docFromContact],
    });
  };

  const handleToContact = () => {
    if (isBlocked) {
      return;
    }

    if (doc?.lines.length && documentType?.remainsField === 'toContact') {
      Alert.alert('Ошибка!', 'Нельзя изменить контакт при наличии позиций.', [{ text: 'OK' }]);
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(toContactType?.id),
      fieldName: 'toContact',
      value: docToContact && [docToContact],
    });
  };

  ///////////////////////////////////
  // useEffect(() => {
  //   dispatch(appActions.setFormParams({ fromContact: undefined, toContact: undefined }));
  // }, [dispatch, docDocumentType]);

  const handlePresentType = () => {
    if (isBlocked) {
      return;
    }
    if (doc?.lines.length) {
      Alert.alert('Ошибка!', 'Нельзя изменить тип документа при наличии позиций.', [{ text: 'OK' }]);
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'documentType',
      fieldName: 'documentType',
      value: docDocumentType && [docDocumentType],
      refFieldName: 'description',
    });
  };

  const [visibleFrom, setVisibleFrom] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);

  const handleFromContactType = useCallback(
    (option) => {
      if (!(option.id === docFromContactType?.id)) {
        dispatch(appActions.setFormParams({ fromContactType: option, fromContact: undefined }));
      }
      setVisibleFrom(false);
    },
    [dispatch, docFromContactType],
  );

  const handleToContactType = useCallback(
    (option) => {
      if (!(option.id === docToContactType?.id)) {
        dispatch(appActions.setFormParams({ toContactType: option, toContact: undefined }));
      }
      setVisibleTo(false);
    },
    [dispatch, docToContactType],
  );
  // useEffect(() => {
  //   return;
  // }, [docFromContactType]);

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
          label="Тип документа"
          value={docDocumentType?.description}
          onPress={handlePresentType}
          disabled={isBlocked}
        />
        {documentType?.fromType ? (
          <View style={[localStyles.border, { borderColor: isBlocked ? colors.disabled : colors.primary }]}>
            <MenuItem
              options={contactTypes}
              onChange={(option) => {
                handleFromContactType(option);
              }}
              onPress={() => {
                setVisibleFrom(true);
              }}
              onDismiss={() => setVisibleFrom(false)}
              title={docFromContactType?.value}
              visible={visibleFrom}
              activeOptionId={docFromContact?.id}
              disabled={isBlocked}
            />

            <SelectableInput
              label={documentType.fromDescription}
              value={docFromContact?.name}
              onPress={handleFromContact}
              disabled={isBlocked}
            />
          </View>
        ) : null}
        {documentType?.toType ? (
          <View style={[localStyles.border, { borderColor: isBlocked ? colors.disabled : colors.primary }]}>
            <MenuItem
              options={contactTypes}
              onChange={(option) => {
                handleToContactType(option);
              }}
              onPress={() => {
                setVisibleTo(true);
              }}
              onDismiss={() => setVisibleTo(false)}
              title={docToContactType?.value}
              visible={visibleTo}
              activeOptionId={docToContact?.id}
              disabled={isBlocked}
            />
            <SelectableInput
              label={documentType.toDescription}
              value={docToContact?.name}
              onPress={handleToContact}
              disabled={isBlocked}
            />
          </View>
        ) : null}
        <Input
          label="Комментарий"
          value={docComment}
          onChangeText={(text) => {
            dispatch(appActions.setFormParams({ comment: text.trim() || '' }));
          }}
          disabled={isBlocked}
          clearInput={true}
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
    paddingLeft: 5,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 2,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 2,
  },
});
