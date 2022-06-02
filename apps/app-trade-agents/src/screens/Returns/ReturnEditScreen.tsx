import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, StackActions, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  appActions,
  docSelectors,
  documentActions,
  refSelectors,
  useDispatch as useDocDispatch,
  useDispatch,
  useSelector,
} from '@lib/store';
import { AppInputScreen, Input, SelectableInput, SaveButton, SubTitle, RadioGroup } from '@lib/mobile-ui';
import { IDocumentType } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IOutlet, IReturnDocument, IReturnFormParam } from '../../store/types';
import { getNextDocNumber } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';
import { statusList } from '../../utils/constants';

const ReturnEditScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const { colors } = useTheme();

  const returns = docSelectors.selectByDocType<IReturnDocument>('return');
  const returnDoc = returns?.find((e) => e.id === id);

  const returnType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'return');

  const formParams = useSelector((state) => state.app.formParams);

  const newNumber = getNextDocNumber(returns);

  const {
    contact: docContact,
    outlet: docOutlet,
    number: docNumber,
    documentDate: docDocumentDate,
    status: docStatus,
    route: docRoute,
  } = useMemo(() => {
    return formParams as IReturnFormParam;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === docOutlet?.id);

  useEffect(() => {
    if (!docContact && !!docOutlet) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['contact']: outlet?.company,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docContact, outlet?.company]);

  useEffect(() => {
    if (!!docContact && !!docOutlet && docContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          ...formParams,
          ['outlet']: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    if (returnDoc) {
      dispatch(
        appActions.setFormParams({
          number: returnDoc.number,
          contact: returnDoc.head.contact,
          outlet: returnDoc.head.outlet,
          route: returnDoc.head.route,
          documentDate: returnDoc.documentDate,
          status: returnDoc.status,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: newNumber,
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, newNumber, returnDoc]);

  const handleSave = useCallback(() => {
    if (!(docNumber && docContact && docOutlet && docDocumentDate)) {
      return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? generateId() : id;

    if (!id) {
      if (!returnType) {
        return Alert.alert('Ошибка!', 'Тип документа для возврата не найден', [{ text: 'OK' }]);
      }

      const newReturnDate = new Date().toISOString();

      const newReturn: IReturnDocument = {
        id: docId,
        documentType: returnType,
        number: docNumber,
        documentDate: newReturnDate,
        status: 'DRAFT',
        head: {
          contact: docContact,
          outlet: docOutlet,
        },
        lines: [],
        creationDate: newReturnDate,
        editionDate: newReturnDate,
      };

      docDispatch(documentActions.addDocument(newReturn));

      navigation.dispatch(StackActions.replace('ReturnView', { id: newReturn.id }));
    } else {
      if (!returnDoc) {
        return;
      }

      const updatedReturnDate = new Date().toISOString();

      const updatedReturn: IReturnDocument = {
        ...returnDoc,
        id,
        number: docNumber,
        documentDate: docDocumentDate,
        status: docStatus || 'DRAFT',
        head: {
          ...returnDoc.head,
          contact: docContact,
          outlet: docOutlet,
        },
        lines: returnDoc.lines,
        creationDate: returnDoc.creationDate || updatedReturnDate,
        editionDate: updatedReturnDate,
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedReturn }));

      navigation.navigate('ReturnView', { id });
    }
  }, [
    docNumber,
    docContact,
    docOutlet,
    docDocumentDate,
    id,
    returnType,
    docDispatch,
    navigation,
    returnDoc,
    docStatus,
  ]);

  const isBlocked = docStatus !== 'DRAFT' || !!docRoute;

  const renderRight = useCallback(
    () => ['DRAFT', 'READY'].includes(docStatus || 'DRAFT') && <SaveButton onPress={handleSave} />,
    [docStatus, handleSave],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  const handlePresentContact = () => {
    if (isBlocked) {
      return;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact && [docContact],
    });
  };

  const handlePresentOutlet = () => {
    //TODO: если изменился контакт, то и магазин должен обнулиться
    if (isBlocked) {
      return;
    }

    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      clause: params,
      value: docOutlet && [docOutlet],
    });
  };

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView>
        <View style={[localStyles.switchContainer, localStyles.border, { borderColor: colors.primary }]}>
          <RadioGroup
            options={statusList}
            onChange={() => {
              dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
            }}
            activeButtonId={statusList.find((i) => i.id === docStatus)?.id}
            directionRow={true}
          />
        </View>
        <Input
          label="Номер"
          value={docNumber}
          onChangeText={(text) => dispatch(appActions.setFormParams({ number: text.trim() }))}
          disabled={isBlocked}
        />
        <SelectableInput
          label="Организация"
          value={docContact?.name}
          onPress={handlePresentContact}
          disabled={isBlocked}
        />
        <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} disabled={isBlocked} />
      </ScrollView>
    </AppInputScreen>
  );
};

export default ReturnEditScreen;

const localStyles = StyleSheet.create({
  switchContainer: {
    marginVertical: 10,
  },
  border: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
});
