import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Divider, IconButton, useTheme } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IDocument, IDocumentType, IReference } from '@lib/types';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, useDispatch, documentActions, appActions, refSelectors, useSelector } from '@lib/store';
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

import { IListItem } from '@lib/mobile-types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IDepartment, IDocFormParam, IDocDocument } from '../../store/types';
import { getNextDocNumber } from '../../utils/constants';

export const DocEditScreen = () => {
  const id = useRoute<RouteProp<DocStackParamList, 'DocEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [chevronFD, setChevronFD] = useState(false);

  const fromDepartmentRef = useRef<BottomSheetModal>(null);

  const handlePresentFD = useCallback(() => {
    fromDepartmentRef.current?.present();
    setChevronFD(true);
  }, [fromDepartmentRef]);

  const [chevronTD, setChevronTD] = useState(false);

  const toDepartmentRef = useRef<BottomSheetModal>(null);

  const handlePresentTD = useCallback(() => {
    toDepartmentRef.current?.present();
    setChevronTD(true);
  }, [toDepartmentRef]);

  const formParams = useSelector((state) => state.app.formParams as IDocFormParam);
  // const inventory = docSelectors.selectByDocType<IDocDocument>('inventory')?.find((e) => e.id === id);
  const documents = useSelector((state) => state.documents.list) as IDocDocument[];

  const newNumber = getNextDocNumber(documents);

  const inventory = useSelector((state) => state.documents.list).find((e) => e.id === id) as IDocDocument | undefined;
  // const docType = refSelectors
  //   .selectByName<IReference<IDocumentType>>('documentType')
  //   ?.data.filter((t) => t.name !== 'inventory');

  const {
    documentType: docDocumentType,
    fromDepartment: docFromDepartment,
    toDepartment: docToDepartment,
    documentDate: docDate,
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

  const fromDepartment = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docFromDepartment?.id);

  useEffect(() => {
    if (!docFromDepartment) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['department']: fromDepartment?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docFromDepartment]);

  const toDepartment = refSelectors
    .selectByName<IDepartment>('department')
    ?.data?.find((e) => e.id === docToDepartment?.id);

  useEffect(() => {
    if (!docToDepartment) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['department']: toDepartment?.name,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docToDepartment]);

  const documentType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data?.find((e) => e.id === docDocumentType?.id);

  useEffect(() => {
    if (!docDocumentType) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['documentType']: documentType?.description,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docDocumentType]);

  useEffect(() => {
    // Инициализируем параметры
    if (inventory) {
      dispatch(
        appActions.setFormParams({
          number: inventory.number,
          documentType: inventory.documentType,
          documentDate: inventory.documentDate,
          comment: inventory.head.comment,
          fromDepartment: inventory.head.fromDepartment,
          toDepartment: inventory.head.toDepartment,
          status: inventory.status,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: newNumber, //'1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, inventory, newNumber]);

  const handleSave = useCallback(() => {
    // if (!docType) {
    //   return Alert.alert('Ошибка!', 'Тип документа "Инвентаризация" не найден', [{ text: 'OK' }]);
    // }
    if (!(docNumber && docToDepartment && docDate && docDocumentType)) {
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;
    const createdDate = new Date().toISOString();

    if (!id) {
      const newInventory: IDocDocument = {
        id: docId,
        documentType: docDocumentType,
        number: newNumber,
        documentDate: docDate,
        status: 'DRAFT',
        head: {
          comment: docComment,
          fromDepartment: docFromDepartment,
          toDepartment: docToDepartment,
        },
        lines: [],
        creationDate: createdDate,
        editionDate: createdDate,
      };

      dispatch(documentActions.addDocument(newInventory));

      navigation.dispatch(StackActions.replace('DocView', { id: newInventory.id }));
    } else {
      if (!inventory) {
        return;
      }

      const updatedDate = new Date().toISOString();

      const updatedInventory: IDocDocument = {
        ...inventory,
        id,
        number: docNumber as string,
        status: docStatus || 'DRAFT',
        documentDate: docDate,
        documentType: docDocumentType,
        errorMessage: undefined,
        head: {
          ...inventory.head,
          comment: docComment as string,
          fromDepartment: docFromDepartment,
          toDepartment: docToDepartment,
        },
        lines: inventory.lines,
        creationDate: inventory.creationDate || updatedDate,
        editionDate: updatedDate,
      };

      dispatch(documentActions.updateDocument({ docId: id, document: updatedInventory }));
      navigation.navigate('DocView', { id });
    }
  }, [
    docNumber,
    docToDepartment,
    docDate,
    docDocumentType,
    id,
    newNumber,
    docComment,
    docFromDepartment,
    dispatch,
    navigation,
    inventory,
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

  const handlePresentDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(selectedFD.id),
      fieldName: 'fromDepartment',
      value: docFromDepartment && [docFromDepartment],
    });
  };

  const handleNextDepartment = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: String(selectedTD.id),
      fieldName: 'toDepartment',
      value: docToDepartment && [docToDepartment],
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

  const currentListFD: IListItem[] = useMemo(() => {
    // const newCurrentList = routeList.map((item) => ({
    //   id: item.id,
    //   value: `Маршрут №${item.number} на ${getDateString(item.documentDate)}`,
    // }));
    // return newCurrentList;
    const newCurrentList = [
      { id: 'department', value: 'Подразделение' },
      { id: 'contact', value: 'Организация' },
      { id: 'employee', value: 'Сотрудник' },
    ];
    return newCurrentList;
  }, []);

  const [selectedFD, setSelectedFD] = useState(currentListFD[0]);
  const [newSelectedFD, setNewSelectedFD] = useState(selectedFD);

  const handleDismissFD = () => {
    fromDepartmentRef.current?.dismiss();
    setNewSelectedFD(selectedFD);
    setChevronFD(false);
  };

  const handleApplyFD = () => {
    fromDepartmentRef.current?.dismiss();
    setSelectedFD(newSelectedFD);
    setChevronFD(false);
  };

  const currentListTD: IListItem[] = useMemo(() => {
    const newCurrentList = [
      { id: 'department', value: 'Подразделение' },
      { id: 'contact', value: 'Организация' },
      { id: 'employee', value: 'Сотрудник' },
    ];
    return newCurrentList;
  }, []);

  const [selectedTD, setSelectedTD] = useState(
    currentListTD.find((item) => item.id === documentType) || currentListTD[0],
  );
  const [newSelectedTD, setNewSelectedTD] = useState(selectedTD);

  const handleDismissTD = () => {
    toDepartmentRef.current?.dismiss();
    setNewSelectedTD(selectedTD);
    setChevronTD(false);
  };

  const handleApplyTD = () => {
    toDepartmentRef.current?.dismiss();
    setSelectedTD(newSelectedTD);
    setChevronTD(false);
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
              <TouchableOpacity onPress={handlePresentFD} /*disabled={loading}*/>
                <Text style={localStyles.subHeading}>{selectedFD?.value}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <IconButton icon={chevronFD ? 'chevron-up' : 'chevron-down'} size={25} onPress={handlePresentFD} />
            </View>
          </View>
          <SelectableInput
            label="Откуда"
            value={docFromDepartment?.name}
            onPress={handlePresentDepartment}
            disabled={isBlocked}
          />
        </View>

        <View style={[localStyles.border, { borderColor: colors.primary }]}>
          <View style={localStyles.container}>
            <View style={localStyles.subHeadingDepartment}>
              <TouchableOpacity onPress={handlePresentTD} /*disabled={loading}*/>
                <Text style={localStyles.subHeading}>{selectedTD?.value}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <IconButton icon={chevronTD ? 'chevron-up' : 'chevron-down'} size={25} onPress={handlePresentTD} />
            </View>
          </View>
          <SelectableInput
            label="Куда"
            value={docToDepartment?.name}
            onPress={handleNextDepartment}
            disabled={isBlocked}
          />
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
        sheetRef={fromDepartmentRef}
        title={'Тип контакта'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissFD}
        onApply={handleApplyFD}
      >
        <RadioGroup
          options={currentListFD}
          onChange={(option) => setNewSelectedFD(option)}
          activeButtonId={newSelectedFD?.id}
        />
        <View style={localStyles.sheet} />
      </BottomSheet>
      <BottomSheet
        sheetRef={toDepartmentRef}
        title={'Тип контакта'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissTD}
        onApply={handleApplyTD}
      >
        <RadioGroup
          options={currentListTD}
          onChange={(option) => setNewSelectedTD(option)}
          activeButtonId={newSelectedTD?.id}
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
