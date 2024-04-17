import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-paper';

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

import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-hooks';

import { IDocumentType, IReference, ScreenState } from '@lib/types';

import { PalletStackParamList } from '../../navigation/Root/types';
import { IPalletFormParam, IPalletDocument } from '../../store/types';
import { STATUS_LIST } from '../../utils/constants';
import { getEan13Barcode, getNextDocNumber } from '../../utils/helpers';

export const PalletEditScreen = () => {
  const id = useRoute<RouteProp<PalletStackParamList, 'PalletEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<PalletStackParamList, 'PalletEdit'>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const formParams = useSelector((state) => state.app.formParams as IPalletFormParam);

  const documents = useFilteredDocList<IPalletDocument>('pallet');

  const palletType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'pallet');

  const doc = useMemo(() => documents?.find((e) => e.id === id), [documents, id]);

  //Вытягиваем свойства formParams и переопределяем их названия для удобства
  const {
    boxWeight: docBoxWeight,
    number: docNumber,
    status: docStatus,
    documentDate: docDate,
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
          boxWeight: doc.head.boxWeight,
        }),
      );
    } else {
      const newNumber = getNextDocNumber(documents);
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doc]);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      if (!palletType) {
        setScreenState('idle');

        return Alert.alert('Ошибка!', 'Тип документа для сверки не найден', [{ text: 'OK' }]);
      }
      if (!docBoxWeight || !docNumber || !docDate) {
        setScreenState('idle');

        return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
      }

      const docId = !id ? generateId() : id;
      const createdDate = new Date().toISOString();

      const palletId = getEan13Barcode();

      if (!id) {
        const newDoc: IPalletDocument = {
          id: docId,
          documentType: palletType,
          number: docNumber && docNumber.trim(),
          documentDate: createdDate,
          status: 'DRAFT',
          head: {
            palletId,
            boxWeight: docBoxWeight,
          },
          lines: [],
          creationDate: createdDate,
          editionDate: createdDate,
        };
        dispatch(documentActions.addDocument(newDoc));

        navigation.dispatch(StackActions.replace('PalletView', { id: newDoc.id }));
      } else {
        if (!doc) {
          setScreenState('idle');

          return;
        }

        const updatedDate = new Date().toISOString();

        const updatedDoc: IPalletDocument = {
          ...doc,
          number: docNumber && docNumber.trim(),
          status: docStatus || 'DRAFT',
          head: {
            ...doc.head,
            boxWeight: docBoxWeight,
          },
          creationDate: doc.creationDate || updatedDate,
          editionDate: updatedDate,
        };

        dispatch(documentActions.updateDocument({ docId: id, document: updatedDoc }));
        setScreenState('idle');

        navigation.navigate('PalletView', { id });
      }
    }
  }, [palletType, docNumber, id, dispatch, navigation, doc, docStatus, screenState, docBoxWeight, docDate]);

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
          <SelectableInput label="Дата" value={getDateString(docDate || '')} disabled={true} />

          <Input
            label="Вес коробки"
            value={docBoxWeight === 0 ? '' : docBoxWeight?.toString()}
            onChangeText={(text) => {
              dispatch(appActions.setFormParams({ boxWeight: text || '' }));
            }}
            keyboardType={'numeric'}
            clearInput={true}
            autoCapitalize="none"
            disabled={docStatus !== 'DRAFT'}
          />
        </ScrollView>
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
