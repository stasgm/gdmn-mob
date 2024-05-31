import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute, StackActions, useTheme, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  SelectableInput,
  Input,
  SaveButton,
  SubTitle,
  AppScreen,
  RadioGroup,
  AppActivityIndicator,
  navBackButton,
} from '@lib/mobile-ui';
import { useDispatch, documentActions, appActions, useSelector, refSelectors } from '@lib/store';

import { generateId, getDateString, isNamedEntity, useFilteredDocList } from '@lib/mobile-hooks';

import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { RevisionStackParamList } from '../../navigation/Root/types';
import { IRevisionFormParam, IRevisionDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getNextDocNumber } from '../../utils/helpers';

export const RevisionEditScreen = () => {
  const id = useRoute<RouteProp<RevisionStackParamList, 'RevisionEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<RevisionStackParamList, 'RevisionEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const formParams = useSelector((state) => state.app.formParams as IRevisionFormParam);

  const documents = useFilteredDocList<IRevisionDocument>('revision');

  const revisionType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'revision');

  const doc = useMemo(() => documents?.find((e) => e.id === id), [documents, id]);

  const departmentSetting = useSelector((state) => state.settings?.userData?.toDepartment?.data);

  const defaultDepart = useMemo(
    () => (isNamedEntity(departmentSetting) ? departmentSetting : undefined),
    [departmentSetting],
  );

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    department: docDepartment,
    documentDate: docDate,
    number: docNumber,
    comment: docComment,
    status: docStatus,
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
          department: doc.head.department,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(documents);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          department: defaultDepart,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc, defaultDepart]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      if (!revisionType) {
        setScreenState('idle');

        return Alert.alert('Ошибка!', 'Тип документа для сверки не найден', [{ text: 'OK' }]);
      }
      if (!docNumber || !docDate || !docDepartment) {
        setScreenState('idle');

        return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      if (!id) {
        const newDoc: IRevisionDocument = {
          id: docId,
          documentType: revisionType,
          number: docNumber && docNumber.trim(),
          documentDate: docDate,
          status: 'DRAFT',
          head: {
            comment: docComment && docComment.trim(),
            department: docDepartment,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        navigation.dispatch(StackActions.replace('RevisionView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');

          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IRevisionDocument = {
          ...doc,
          id,
          number: docNumber && docNumber.trim(),
          status: docStatus || 'DRAFT',
          documentDate: docDate,
          documentType: revisionType,
          errorMessage: undefined,
          head: {
            ...doc.head,
            comment: docComment && docComment.trim(),
            department: docDepartment,
          },
          lines: doc.lines,
          creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        setScreenState('idle');

        navigation.navigate('RevisionView', { id });
      }
    }
  }, [
    revisionType,
    docNumber,
    docDate,
    docDepartment,
    id,
    docComment,
    dispatch,
    navigation,
    doc,
    docStatus,
    screenState,
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

  const handleApplyDate = useCallback(
    (_event: any, selectedDate: Date | undefined) => {
      //Закрываем календарь и записываем выбранную дату
      setShowDate(false);

      if (selectedDate) {
        dispatch(appActions.setFormParams({ documentDate: selectedDate.toISOString() }));
      }
    },
    [dispatch],
  );

  const handlePresentDate = useCallback(() => {
    if (docStatus !== 'DRAFT') {
      return;
    }

    setShowDate(true);
  }, [docStatus]);

  const handlePresentDepartment = useCallback(() => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'department',
      fieldName: 'department',
      value: docDepartment && [docDepartment],
    });
  }, [docDepartment, isBlocked, navigation]);

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
          <SelectableInput
            label="Подразделение"
            value={docDepartment?.name}
            onPress={handlePresentDepartment}
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
});
