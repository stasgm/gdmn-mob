import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Divider, IconButton, useTheme } from 'react-native-paper';
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
} from '@lib/mobile-ui';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

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

  const [selectedFromContact, setSelectedFromContact] = useState(docFromContactType);
  const [selectedToContact, setSelectedToContact] = useState(docToContactType);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fromContact = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docFromContact?.id);

  useEffect(() => {
    if (!docFromContact) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['fromContact']: fromContact?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docFromContact]);

  const toContact = refSelectors.selectByName<IDepartment>('department')?.data?.find((e) => e.id === docToContact?.id);

  useEffect(() => {
    if (!docToContact) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['toContact']: toContact?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docToContact]);

  const documentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data?.find((e) => e.id === docDocumentType?.id);

  useEffect(() => {
    if (!docDocumentType) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['documentType']: documentType,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDocumentType, documentType]);

  const fromContactType = contactTypes.find((e) => e.id === docFromContactType?.id);

  useEffect(() => {
    if (!docFromContactType) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['fromContactType']: fromContactType,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docFromContactType, fromContactType]);

  const toContactType = contactTypes.find((e) => e.id === docToContactType?.id);

  useEffect(() => {
    if (!docToContactType) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['toContactType']: toContactType,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docToContactType, toContactType]);

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
          fromContactType: contactTypes[0],
          toContactType: contactTypes[0],
        }),
      );
    }
  }, [dispatch, doc, newNumber]);

  const handleSave = useCallback(() => {
    // if (!docType) {
    //   return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден', [{ text: 'OK' }]);
    // }
    if (!(docNumber && docToContact && docDate && docDocumentType)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
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
    docNumber,
    docToContact,
    docDate,
    docDocumentType,
    id,
    newNumber,
    docComment,
    docFromContact,
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

  const handlePresentContact = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(selectedFromContact?.id || fromContactType?.id),
      fieldName: 'fromContact',
      value: docFromContact && [docFromContact],
    });
  };

  const handleNextContact = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(selectedToContact?.id || toContactType?.id),
      fieldName: 'toContact',
      value: docToContact && [docToContact],
    });
  };

  const handlePresentType = () => {
    if (isBlocked) {
      return;
    }
    navigation.navigate('SelectRefItem', {
      refName: 'documentType',
      fieldName: 'documentType',
      value: docDocumentType && [docDocumentType],
      refFieldName: 'description',
    });
  };

  const [chevronFromContact, setChevronFromContact] = useState(false);

  const fromContactRef = useRef<BottomSheetModal>(null);

  const handlePresentFromContact = useCallback(() => {
    setSelectedFromContact(fromContactType || contactTypes[0]);
    fromContactRef.current?.present();
    setChevronFromContact(true);
  }, [fromContactType]);

  const handleDismissFromContact = () => {
    fromContactRef.current?.dismiss();
    setChevronFromContact(false);
  };

  const handleApplyFromContact = () => {
    fromContactRef.current?.dismiss();
    setChevronFromContact(false);
    dispatch(appActions.setFormParams({ fromContactType: selectedFromContact }));
  };

  const [chevronToContact, setChevronToContact] = useState(false);

  const toContactRef = useRef<BottomSheetModal>(null);

  const handlePresentToContact = useCallback(() => {
    setSelectedToContact(toContactType || contactTypes[0]);
    toContactRef.current?.present();
    setChevronToContact(true);
  }, [toContactType]);

  const handleDismissToContact = () => {
    toContactRef.current?.dismiss();
    setChevronToContact(false);
  };

  const handleApplyToContact = () => {
    toContactRef.current?.dismiss();
    setChevronToContact(false);
    dispatch(appActions.setFormParams({ toContactType: selectedToContact }));
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
          label="Тип документа"
          value={docDocumentType?.description}
          onPress={handlePresentType}
          disabled={isBlocked}
        />

        <View style={[localStyles.border, { borderColor: colors.primary }]}>
          <View style={localStyles.container}>
            <View style={localStyles.subHeadingDepartment}>
              <TouchableOpacity onPress={handlePresentFromContact} /*disabled={loading}*/>
                <Text style={localStyles.subHeading}>{docFromContactType?.value}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <IconButton
                icon={chevronFromContact ? 'chevron-up' : 'chevron-down'}
                size={25}
                onPress={handlePresentFromContact}
              />
            </View>
          </View>
          <SelectableInput
            label="Откуда"
            value={docFromContact?.name}
            onPress={handlePresentContact}
            disabled={isBlocked}
          />
        </View>

        <View style={[localStyles.border, { borderColor: colors.primary }]}>
          <View style={localStyles.container}>
            <View style={localStyles.subHeadingDepartment}>
              <TouchableOpacity onPress={handlePresentToContact} /*disabled={loading}*/>
                <Text style={localStyles.subHeading}>{docToContactType?.value}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <IconButton
                icon={chevronToContact ? 'chevron-up' : 'chevron-down'}
                size={25}
                onPress={handlePresentToContact}
              />
            </View>
          </View>
          <SelectableInput label="Куда" value={docToContact?.name} onPress={handleNextContact} disabled={isBlocked} />
        </View>
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
      <BottomSheet
        sheetRef={fromContactRef}
        title={'Тип контакта'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissFromContact}
        onApply={handleApplyFromContact}
      >
        <RadioGroup
          options={contactTypes}
          onChange={(option) => setSelectedFromContact(option)}
          activeButtonId={selectedFromContact?.id}
        />
        <View style={localStyles.sheet} />
      </BottomSheet>
      <BottomSheet
        sheetRef={toContactRef}
        title={'Тип контакта'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissToContact}
        onApply={handleApplyToContact}
      >
        <RadioGroup
          options={contactTypes}
          onChange={(option) => setSelectedToContact(option)}
          activeButtonId={selectedToContact?.id}
        />
        <View style={localStyles.sheet} />
      </BottomSheet>
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
  sheet: {
    // marginTop: 100,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 12,
    // paddingVertical: 3,
    // marginVertical: 6,
    // width: '100%',
  },
  subHeading: {
    fontSize: 14,
  },
  subHeadingDepartment: {
    width: '85%',
    // fontSize: 14,
  },
});
