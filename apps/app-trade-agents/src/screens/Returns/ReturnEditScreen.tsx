import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';

import { docSelectors, documentActions, refSelectors, useDispatch as useDocDispatch } from '@lib/store';
import {
  BackButton,
  AppInputScreen,
  Input,
  SelectableInput,
  SaveButton,
  globalStyles as styles,
  SubTitle,
} from '@lib/mobile-ui';

import { Divider } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { IReference } from '@lib/types';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IOutlet, IReturnDocument } from '../../store/docs/types';

import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';
import { returnType } from '../../store/docs/mock';
import { IReturnFormParam } from '../../store/app/types';

const ReturnEditScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnEdit'>>().params?.id;
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnEdit'>>();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const returnDoc = (docSelectors.selectByDocType('return') as IReturnDocument[])?.find((e) => e.id === id);

  const formParams = useSelector((state) => state.app.formParams);

  const {
    contact: docContact,
    outlet: docOutlet,
    number: docNumber,
    documentDate: docDocumentDate,
    reason: docReason,
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

  const outlet = (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find(
    (e) => e.id === docOutlet?.id,
  );

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
          depart: returnDoc.head.depart,
          reason: returnDoc.head.reason,
          route: returnDoc.head.route,
          documentDate: returnDoc.documentDate,
          status: returnDoc.status,
        }),
      );
    } else {
      dispatch(
        appActions.setFormParams({
          number: '1',
          onDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
        }),
      );
    }
  }, [dispatch, returnDoc]);

  const handleSave = useCallback(() => {
    if (!(docNumber && docContact && docOutlet && docReason && docDocumentDate)) {
      return Alert.alert('Внимание!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    const docId = !id ? uuid() : id;

    if (!id) {
      const newReturn: IReturnDocument = {
        id: docId,
        documentType: returnType,
        number: docNumber,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          contact: docContact,
          outlet: docOutlet,
          reason: docReason,
        },
        lines: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      docDispatch(documentActions.addDocument(newReturn));

      navigation.dispatch(StackActions.replace('ReturnView', { id: newReturn.id }));
    } else {
      if (!returnDoc) {
        return;
      }

      const updatedReturn: IReturnDocument = {
        ...returnDoc,
        id,
        documentType: returnType,
        number: docNumber,
        documentDate: docDocumentDate,
        status: docStatus || 'DRAFT',
        head: {
          ...returnDoc.head,
          contact: docContact,
          outlet: docOutlet,
          reason: docReason,
        },
        lines: returnDoc.lines,
        creationDate: returnDoc.creationDate || new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      docDispatch(documentActions.updateDocument({ docId: id, document: updatedReturn }));

      navigation.navigate('ReturnView', { id });
    }
  }, [docNumber, docContact, docOutlet, docDocumentDate, id, navigation, docReason, docDispatch, returnDoc, docStatus]);

  const isBlocked = docStatus !== 'DRAFT' || docRoute;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => !isBlocked && <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, isBlocked, navigation]);

  const statusName = id ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  const handlePresentContact = () => {
    if (isBlocked) {
      return;
    }

    /*     if (docRoute) {
          return Alert.alert('Внимание!', 'Нельзя менять организацию! Документ возврата привязан к маршруту.', [
            { text: 'OK' },
          ]);
        } */

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

    /* if (docRoute) {
      return Alert.alert('Внимание!', 'Нельзя менять магазин! Документ возврата привязан к маршруту.', [
        { text: 'OK' },
      ]);
    } */

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
        {(docStatus === 'DRAFT' || docStatus === 'READY') && (
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
          editable={!isBlocked}
        />
        <SelectableInput label="Организация" value={docContact?.name} onPress={handlePresentContact} />
        <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} />
        <Input
          label="Причина возврата"
          value={docReason}
          onChangeText={(text) => dispatch(appActions.setFormParams({ reason: text }))}
          editable={!isBlocked}
        />
      </ScrollView>
    </AppInputScreen>
  );
};

export default ReturnEditScreen;

const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
  },
});
