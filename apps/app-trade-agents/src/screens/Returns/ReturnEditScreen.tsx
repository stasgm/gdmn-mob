import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Switch, View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';

import { docSelectors, documentActions, useDispatch as useDocDispatch } from '@lib/store';
import { INamedEntity, IDocument, IEntity, IUserDocument, StatusType } from '@lib/types';
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

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IReturnDocument } from '../../store/docs/types';

import { useDispatch, useSelector } from '../../store';
import { appActions } from '../../store/app/actions';
import { returnType } from '../../store/docs/mock';
import { IFormParam } from '../../store/app/types';

interface IReturnFormParam extends IFormParam {
  contact?: INamedEntity;
  outlet?: INamedEntity;
  number?: string;
  documentDate?: string;
  depart?: INamedEntity;
  reason?: string;
  road?: INamedEntity;
  status?: StatusType;
}

const ReturnEditScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnEdit'>>().params?.id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const docDispatch = useDocDispatch();

  const returnDoc = (docSelectors.selectByDocType('return') as unknown as IReturnDocument[])?.find((e) => e.id === id);

  const [statusId, setStatusId] = useState('DRAFT');

  const formParams = useSelector((state) => state.app.formParams);

  const {
    contact: docContact,
    outlet: docOutlet,
    number: docNumber,
    documentDate: docDocumentDate,
    depart: docDepart,
    reason: docReason,
    road: docRoad,
    status: docStatus,
  } = useMemo(() => {
    return formParams as IReturnFormParam;
  }, [formParams]);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStatusId(returnDoc?.status || 'DRAFT');

    // Инициализируем параметры
    if (returnDoc) {
      dispatch(
        appActions.setFormParams({
          number: returnDoc.number,
          contact: returnDoc.head.contact,
          outlet: returnDoc.head.outlet,
          depart: returnDoc.head.depart,
          reason: returnDoc.head.reason,
          road: returnDoc.head.road,
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
      return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
    }

    if (!id) {
      const newReturn: IReturnDocument = {
        id: uuid(),
        documentType: returnType,
        number: docNumber,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          contact: docContact,
          outlet: docOutlet,
          depart: docDepart,
          reason: docReason,
          road: docRoad,
        },
        lines: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      docDispatch(documentActions.addDocument(newReturn as unknown as IUserDocument<IDocument, IEntity[]>));
    } else {
      if (!returnDoc) {
        return;
      }

      const updatedHead: IReturnDocument = {
        id,
        documentType: returnType,
        number: docNumber,
        documentDate: docDocumentDate,
        status: docStatus || 'DRAFT',
        head: {
          contact: docContact,
          outlet: docOutlet,
          depart: docDepart,
          reason: docReason,
          road: docRoad,
        },
        lines: { ...returnDoc.lines },
        creationDate: returnDoc.creationDate || new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      docDispatch(documentActions.updateDocument({ docId: id, head: updatedHead as unknown as IUserDocument }));
    }
    navigation.goBack();
  }, [
    docNumber,
    docContact,
    docOutlet,
    docDocumentDate,
    id,
    navigation,
    docDepart,
    docReason,
    docRoad,
    docDispatch,
    returnDoc,
    docStatus,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [dispatch, handleSave, navigation]);

  const isBlocked = statusId !== 'DRAFT';

  const statusName =
    id !== undefined ? (!isBlocked ? 'Редактирование документа' : 'Просмотр документа') : 'Новый документ';

  const handlePresentContact = () => {
    navigation.navigate('SelectItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: docContact,
    });
  };

  const handlePresentOutlet = () => {
    //TODO: если изменился контакт, то и магазин должен обнулиться
    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectItem', {
      refName: 'outlet',
      fieldName: 'outlet',
      clause: params,
      value: docOutlet,
    });
  };

  const handlePresentDepart = () => {
    //TODO: если изменился контакт, то и магазин должен обнулиться
    const params: Record<string, string> = {};

    if (docContact?.id) {
      params.companyId = docContact?.id;
    }

    navigation.navigate('SelectItem', {
      refName: 'depart',
      fieldName: 'depart',
      clause: params,
      value: docDepart,
    });
  };

  return (
    <AppInputScreen>
      <SubTitle>{statusName}</SubTitle>
      <Divider />
      <ScrollView>
        {(statusId === 'DRAFT' || statusId === 'READY') && (
          <>
            <View style={[styles.directionRow, localStyles.switchContainer]}>
              <Text>Черновик:</Text>
              <Switch
                value={docStatus === 'DRAFT' || !docStatus}
                // disabled={id === undefined}
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
        <SelectableInput
          label="Организация"
          placeholder="Выберите покупателя..."
          value={docContact?.name}
          editable={isBlocked}
          onFocus={handlePresentContact}
        />
        <SelectableInput label="Магазин" value={docOutlet?.name} editable={isBlocked} onFocus={handlePresentOutlet} />
        <SelectableInput
          label="Подразделение"
          placeholder="Выберите покупателя..."
          value={docDepart?.name}
          editable={isBlocked}
          onFocus={handlePresentDepart}
        />
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
