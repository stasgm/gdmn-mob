import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  Menu,
  BackButton,
  AppInputScreen,
  SelectableInput,
  Input,
  SaveButton,
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { getDateString } from '@lib/mobile-app';

import { IDocumentType } from '@lib/types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IDocFormParam, IMovementDocument } from '../../store/types';
import { contactTypes } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';

export const DocEditScreen = () => {
  const id = useRoute<RouteProp<DocStackParamList, 'DocEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const formParams = useSelector((state) => state.app.formParams as IDocFormParam);

  const documents = useSelector((state) => state.documents.list) as IMovementDocument[];
  const documentTypes = refSelectors
    .selectByName<IDocumentType>('documentType')
    ?.data?.sort((a, b) => ((a.sortOrder || 1) < (b.sortOrder || 1) ? -1 : 1));

  const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument | undefined;

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
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

  const documentType = useMemo(
    () => documentTypes.find((d) => d.id === docDocumentType?.id),
    [docDocumentType, documentTypes],
  );

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
          documentType: doc.documentType,
          documentDate: doc.documentDate,
          status: doc.status,
          comment: doc.head.comment,
          fromContact: doc.head.fromContact,
          toContact: doc.head.toContact,
          fromContactType: doc.head.fromContactType,
          toContactType: doc.head.toContactType,
        }),
      );
    } else {
      const dt = documentTypes[0];
      const newNumber = getNextDocNumber(documents);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          documentType: dt,
          fromContactType: contactTypes.find((item) => item.id === dt?.fromType),
          toContactType: contactTypes.find((item) => item.id === dt?.toType),
        }),
      );
    }
  }, [dispatch, doc, documents, documentTypes]);

  const handleSave = useCallback(() => {
    if (
      !documentType ||
      !docDocumentType ||
      !docNumber ||
      !docDate ||
      (documentType.fromRequired && !docFromContact) ||
      (documentType.toRequired && !docToContact)
    ) {
      return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    if (documentType.isRemains && docDate && new Date(docDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      Alert.alert('Внимание!', 'Нельзя выбрать дату меньше текущей.', [{ text: 'OK' }]);
      return;
    }

    const docId = !id ? uuid() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newDoc: IMovementDocument = {
        id: docId,
        documentType: docDocumentType,
        number: docNumber,
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

      const updatedDoc: IMovementDocument = {
        ...doc,
        id,
        number: docNumber,
        status: docStatus || 'DRAFT',
        documentDate: docDate,
        documentType: docDocumentType,
        errorMessage: undefined,
        head: {
          ...doc.head,
          comment: docComment,
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
    documentType,
    docNumber,
    docDate,
    docFromContact,
    docToContact,
    id,
    docDocumentType,
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

  const handleFromContact = () => {
    if (isBlocked || !documentType || !docFromContactType) {
      return;
    }

    if (doc?.lines.length && documentType.remainsField === 'fromContact') {
      Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.fromDescription} при наличии позиций.`, [
        { text: 'OK' },
      ]);
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: docFromContactType.id,
      fieldName: 'fromContact',
      value: docFromContact && [docFromContact],
    });
  };

  const handleToContact = () => {
    if (isBlocked || !documentType || !docToContactType) {
      return;
    }

    if (doc?.lines.length && documentType.remainsField === 'toContact') {
      Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.toDescription} при наличии позиций.`, [
        { text: 'OK' },
      ]);
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: docToContactType.id,
      fieldName: 'toContact',
      value: docToContact && [docToContact],
    });
  };

  const [oldDocTypeId, setOldDocTypeId] = useState<string | undefined>(docDocumentType?.id);

  useEffect(() => {
    //Если меняем тип документа и он не такой, какой был, надо обнулить контакты и подставить соответствующие типы контактов
    if (oldDocTypeId && docDocumentType && docDocumentType.id !== oldDocTypeId) {
      setOldDocTypeId(docDocumentType.id);
      dispatch(
        appActions.setFormParams({
          fromContact: undefined,
          fromContactType: contactTypes.find((item) => item.id === documentType?.fromType),
          toContact: undefined,
          toContactType: contactTypes.find((item) => item.id === documentType?.toType),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDocumentType]);

  const handlePresentType = () => {
    if (isBlocked) {
      return;
    }
    if (doc?.lines.length) {
      Alert.alert('Внимание!', 'Нельзя изменить тип документа при наличии позиций.', [{ text: 'OK' }]);
      return;
    }
    setOldDocTypeId(docDocumentType?.id);
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
      if (doc?.lines.length && documentType?.remainsField === 'fromContact') {
        Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.fromDescription} при наличии позиций.`, [
          { text: 'OK' },
        ]);
        return setVisibleFrom(false);
      }
      if (!(option.id === docFromContactType?.id)) {
        dispatch(appActions.setFormParams({ fromContactType: option, fromContact: undefined }));
      }
      setVisibleFrom(false);
    },
    [dispatch, doc?.lines.length, documentType?.fromDescription, documentType?.remainsField, docFromContactType?.id],
  );

  const handleToContactType = useCallback(
    (option) => {
      if (doc?.lines.length && documentType?.remainsField === 'toContact') {
        Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.toDescription} при наличии позиций.`, [
          { text: 'OK' },
        ]);
        return setVisibleTo(false);
      }
      if (!(option.id === docToContactType?.id)) {
        dispatch(appActions.setFormParams({ toContactType: option, toContact: undefined }));
      }
      setVisibleTo(false);
    },
    [dispatch, doc?.lines.length, documentType?.remainsField, documentType?.toDescription, docToContactType?.id],
  );

  const handlePressFromContact = () => {
    if (doc?.lines.length && documentType?.remainsField === 'fromContact') {
      Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.fromDescription} при наличии позиций.`, [
        { text: 'OK' },
      ]);
    } else {
      setVisibleFrom(true);
    }
  };

  const handlePressToContact = () => {
    if (doc?.lines.length && documentType?.remainsField === 'toContact') {
      Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.toDescription} при наличии позиций.`, [
        { text: 'OK' },
      ]);
    } else {
      setVisibleTo(true);
    }
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
          onPress={handlePresentDate}
          disabled={docStatus !== 'DRAFT'}
        />
        <SelectableInput
          label="Тип документа"
          value={documentType?.description}
          onPress={handlePresentType}
          disabled={isBlocked}
        />
        {!!documentType?.fromType && docFromContactType && (
          <View style={[localStyles.border, { borderColor: isBlocked ? colors.disabled : colors.primary }]}>
            <View style={localStyles.contactType}>
              <Menu
                key={'fromType'}
                options={contactTypes}
                onChange={handleFromContactType}
                onPress={handlePressFromContact}
                onDismiss={() => setVisibleFrom(false)}
                title={docFromContactType?.value || ''}
                visible={visibleFrom}
                activeOptionId={docFromContactType?.id}
                disabled={isBlocked}
                // menuStyle={localStyles.contactType}
                style={localStyles.btnTab}
              />
            </View>
            <SelectableInput
              label={documentType.fromDescription}
              value={docFromContact?.name}
              onPress={handleFromContact}
              disabled={isBlocked}
            />
          </View>
        )}
        {!!documentType?.toType && docToContactType && (
          <View style={[localStyles.border, { borderColor: isBlocked ? colors.disabled : colors.primary }]}>
            <View style={[localStyles.contactType]}>
              <Menu
                key={'toType'}
                options={contactTypes}
                onChange={handleToContactType}
                onPress={handlePressToContact}
                onDismiss={() => setVisibleTo(false)}
                title={docToContactType?.value || ''}
                visible={visibleTo}
                activeOptionId={docToContactType?.id}
                disabled={isBlocked}
                // menuStyle={localStyles.contactType}
                style={localStyles.btnTab}
              />
            </View>
            <SelectableInput
              label={documentType.toDescription}
              value={docToContact?.name}
              onPress={handleToContact}
              disabled={isBlocked}
            />
          </View>
        )}
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
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(docDate || '')}
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
    paddingLeft: 5,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
  contactType: {
    marginTop: -1,
    marginBottom: -4,
  },
  btnTab: {
    alignItems: 'flex-end',
  },
});