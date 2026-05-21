import { RouteProp, StackActions, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { appActions, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { IDocumentType, INamedEntity, IReference, ScreenState } from '@lib/types';

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-hooks';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  AppActivityIndicator,
  AppScreen,
  Input,
  navBackButton,
  RadioGroup,
  SaveButton,
  SelectableInput,
  SubTitle,
} from '@lib/mobile-ui';

import { Divider } from 'react-native-paper';

import { CellMovementStackParamList } from '../../navigation/Root/types';
import { ICellMovementDocument, ICellsMovementFormParam } from '../../store/types';
import { getNextDocNumber } from '../../utils/helpers';
import { STATUS_LIST } from '../../utils/constants';

export const CellMovementEditScreen = () => {
  const id = useRoute<RouteProp<CellMovementStackParamList, 'CellMovementEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<CellMovementStackParamList, 'CellMovementEdit'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const movements = useFilteredDocList<ICellMovementDocument>('movement');

  const doc = useMemo(() => movements?.find((e) => e.id === id), [movements, id]);

  const departments = refSelectors.selectByName<INamedEntity>('department')?.data;

  const userDefaultDepartment = useSelector((state) => state.settings?.userData?.toDepartment?.data) as INamedEntity;
  const defaultDepartment = departments?.find((i) => i.id === userDefaultDepartment?.id);

  const movementType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'movement');

  // const movementSubtypeRef = refSelectors.selectByName<IReference<INamedEntity>>('documentSubtype');

  console.log('movementType', movementType);
  // console.log('movementSubtype', movementSubtype);
  const formParams = useSelector((state) => state.app.formParams as ICellsMovementFormParam);

  // Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    fromDepartment: docFromDepartment,
    toDepartment: docToDepartment,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
    documentSubtype: docDocumentSubtype,
  } = useMemo(() => formParams, [formParams]);

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
          documentDate: doc.documentDate,
          status: doc.status,
          comment: doc.head.comment,
          fromDepartment: doc.head.fromDepartment,
          toDepartment: doc.head.toDepartment,
          documentSubtype: doc.head.documentSubtype,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(movements);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          fromDepartment: defaultDepartment || undefined,
          toDepartment: defaultDepartment || undefined,
          // documentSubtype: movementType || undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepartment]);

  // const [screenState, setScreenState] = useState<ScreenState>('idle');
  useEffect(() => {
    if (screenState === 'saving') {
      if (!movementType || !docNumber || !docDate || !docDocumentSubtype) {
        setScreenState('idle');

        return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      if (
        docDocumentSubtype?.id === 'cellMovement' &&
        !(docFromDepartment?.isAddressStore && docToDepartment?.isAddressStore)
      ) {
        Alert.alert('Внимание!', 'Одно из подразделений должно быть адресного типа. Обратитесь к администратору.', [
          { text: 'OK' },
        ]);
        setScreenState('idle');

        return;
      }

      if (docDocumentSubtype?.id === 'internalMovement' && !docToDepartment?.isAddressStore) {
        Alert.alert('Внимание!', 'Подразделение "Куда" должно быть адресного типа. Обратитесь к администратору.', [
          { text: 'OK' },
        ]);
        setScreenState('idle');

        return;
      }

      if (docDocumentSubtype?.id === 'movement' && !docFromDepartment?.isAddressStore) {
        Alert.alert('Внимание!', 'Подразделение "Откуда" должно быть адресного типа. Обратитесь к администратору.', [
          { text: 'OK' },
        ]);
        setScreenState('idle');

        return;
      }

      if (docDate && new Date(docDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        Alert.alert('Внимание!', 'Нельзя выбрать дату меньше текущей.', [{ text: 'OK' }]);
        setScreenState('idle');

        return;
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      if (!id) {
        const newDoc: ICellMovementDocument = {
          id: docId,
          documentType: movementType,
          number: docNumber && docNumber.trim(),
          documentDate: docDate,
          status: 'DRAFT',
          head: {
            comment: docComment && docComment.trim(),
            fromDepartment: docFromDepartment,
            toDepartment: docToDepartment,
            documentSubtype: docDocumentSubtype,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        navigation.dispatch(StackActions.replace('CellMovementView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');

          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: ICellMovementDocument = {
          ...doc,
          id,
          number: docNumber && docNumber.trim(),
          status: docStatus || 'DRAFT',
          documentDate: docDate,
          // documentType: mo,
          errorMessage: undefined,
          head: {
            ...doc.head,
            comment: docComment && docComment.trim(),
            fromDepartment: docFromDepartment,
            toDepartment: docToDepartment,
            documentSubtype: docDocumentSubtype,
          },
          // lines: doc.lines,
          // creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        setScreenState('idle');
        navigation.navigate('CellMovementView', { id });
      }
    }
  }, [
    docNumber,
    docDate,
    id,
    docComment,
    dispatch,
    navigation,
    doc,
    docStatus,
    screenState,
    movementType,
    setScreenState,
    docFromDepartment,
    docToDepartment,
    docDocumentSubtype,
  ]);

  const renderRight = useCallback(
    () => <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />,
    [screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

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
    if (isBlocked || !movementType) {
      return;
    }

    // if (doc?.lines.length && documentType.remainsField === 'fromContact') {
    //   Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.fromDescription} при наличии позиций.`, [
    //     { text: 'OK' },
    //   ]);
    //   return;
    // }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'fromDepartment',
      value: docFromDepartment && [docFromDepartment],
      descrFieldName: 'taxId',
    });
  };

  const handleToContact = () => {
    if (isBlocked || !movementType) {
      return;
    }

    // if (doc?.lines.length && documentType.remainsField === 'toContact') {
    //   Alert.alert('Внимание!', `Нельзя изменить поле ${documentType.toDescription} при наличии позиций.`, [
    //     { text: 'OK' },
    //   ]);
    //   return;
    // }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'toDepartment',
      value: docToDepartment && [docToDepartment],
      descrFieldName: 'taxId',
    });
  };
  const handlePresentSubtype = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'documentSubtype',
      fieldName: 'documentSubtype',
      value: docDocumentSubtype && [docDocumentSubtype],
    });
  };

  // const [oldDocTypeId, setOldDocTypeId] = useState<string | undefined>(docDocumentType?.id);

  // useEffect(() => {
  //   //Если меняем тип документа и он не такой, какой был, надо обнулить контакты и подставить соответствующие типы контактов

  //   if (oldDocTypeId && docDocumentType && docDocumentType.id !== oldDocTypeId) {
  //     setOldDocTypeId(docDocumentType.id);
  //     dispatch(
  //       appActions.setFormParams({
  //         fromContact:
  //           defaultFromDepartment && docDocumentType?.fromType === 'department' ? defaultFromDepartment : undefined,
  //         fromContactType: contactTypes.find((item) => item.id === documentType?.fromType),
  //         toContact: defaultToDepartment ? defaultToDepartment : undefined,
  //         toContactType: contactTypes.find((item) => item.id === documentType?.toType),
  //       }),
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, docDocumentType, defaultFromDepartment, oldDocTypeId]);

  // useEffect(() => {
  //   //Если меняем тип документа и для поля Откуда есть подразделение по умолчанию
  //   if ((docFromContactType && !doc) || (docFromContactType && oldDocTypeId)) {
  //     dispatch(
  //       appActions.setFormParams({
  //         fromContact:
  //           defaultFromDepartment && docDocumentType?.fromType === 'department' ? defaultFromDepartment : undefined,
  //       }),
  //     );
  //   }
  // }, [dispatch, docDocumentType, defaultFromDepartment, docFromContactType, doc, oldDocTypeId]);

  // const handlePresentType = () => {
  //   if (isBlocked) {
  //     return;
  //   }
  //   if (doc?.lines.length) {
  //     Alert.alert('Внимание!', 'Нельзя изменить тип документа при наличии позиций.', [{ text: 'OK' }]);
  //     return;
  //   }
  //   setOldDocTypeId(docDocumentType?.id);

  //   navigation.navigate('SelectRefItem', {
  //     refName: 'documentType',
  //     fieldName: 'documentType',
  //     clause: { subtype: 'inventory' },
  //     value: docDocumentType && [docDocumentType],
  //     refFieldName: 'description',
  //   });
  // };

  // const [visibleFrom, setVisibleFrom] = useState(false);
  // const [visibleTo, setVisibleTo] = useState(false);

  // const handlePressFromDepartment = () => {
  //   if (doc?.lines.length /*&& movementType?.remainsField === 'fromContact'*/) {
  //     Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.fromDescription} при наличии позиций.`, [
  //       { text: 'OK' },
  //     ]);
  //   } else {
  //     setVisibleFrom(true);
  //   }
  // };

  // const handlePressToDepartment = () => {
  //   if (doc?.lines.length /* && movementType?.remainsField === 'toContact'*/) {
  //     Alert.alert('Внимание!', `Нельзя изменить тип поля ${documentType.toDescription} при наличии позиций.`, [
  //       { text: 'OK' },
  //     ]);
  //   } else {
  //     setVisibleTo(true);
  //   }
  // };

  const handleChangeStatus = useCallback(() => {
    dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
  }, [dispatch, docStatus]);

  const handleChangeNumber = useCallback(
    (text: string) => dispatch(appActions.setFormParams({ number: text })),
    [dispatch],
  );

  const viewStyle = useMemo(
    () => [
      localStyles.switchContainer,
      localStyles.border,
      { borderColor: colors.primary, backgroundColor: colors.card },
    ],
    [colors.card, colors.primary],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} keyboardShouldPersistTaps={'handled'}>
        <SubTitle>{statusName}</SubTitle>
        <Divider />
        <ScrollView>
          <View style={viewStyle}>
            <RadioGroup
              options={STATUS_LIST}
              onChange={handleChangeStatus}
              activeButtonId={STATUS_LIST.find((i) => i.id === docStatus)?.id}
              directionRow={true}
            />
          </View>
          <Input
            label="Номер"
            value={docNumber}
            onChangeText={handleChangeNumber}
            disabled={isBlocked}
            clearInput={true}
            keyboardType="url"
          />
          <SelectableInput
            label="Дата"
            value={getDateString(docDate || '')}
            onPress={handlePresentDate}
            disabled={docStatus !== 'DRAFT'}
          />
          {/* <SelectableInput
            label="Тип"
            value={documentType?.description}
            onPress={handlePresentType}
            disabled={isBlocked}
          /> */}
          <SelectableInput
            label={'Тип'}
            value={docDocumentSubtype?.name}
            onPress={handlePresentSubtype}
            disabled={isBlocked}
          />
          <SelectableInput
            label={'Подразделение'}
            value={docFromDepartment?.name}
            onPress={handleFromContact}
            disabled={isBlocked}
          />

          <SelectableInput
            label={'Подразделение'}
            value={docToDepartment?.name}
            onPress={handleToContact}
            disabled={isBlocked}
          />
          <Input
            label="Комментарий"
            value={docComment}
            onChangeText={(text) => {
              dispatch(appActions.setFormParams({ comment: text || '' }));
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
      </KeyboardAwareScrollView>
    </AppScreen>
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
