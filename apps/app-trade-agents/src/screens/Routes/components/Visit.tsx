import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { documentActions, refSelectors, useDocThunkDispatch, useSelector } from '@lib/store';
import { IDocumentType, INamedEntity } from '@lib/types';
import { IListItem } from '@lib/mobile-types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomSheet,
  InfoBlock,
  ItemSeparator,
  PrimeButton,
  RadioGroup,
  ScreenListItem,
  IListItemProps,
  globalStyles as styles,
} from '@lib/mobile-ui';
import { useSendDocs, getDateString, generateId } from '@lib/mobile-app';

import { useDispatch } from '../../../store';
import { IOrderDocument, IReturnDocument, IVisitDocument } from '../../../store/types';
import { getCurrentPosition } from '../../../utils/expoFunctions';
import { getTimeProcess, twoDigits } from '../../../utils/helpers';
import SwipeListItem from '../../../components/SwipeListItem';
import { navBackButton } from '../../../components/navigateOptions';

interface IVisitProps {
  item: IVisitDocument;
  outlet: INamedEntity;
  contact: INamedEntity;
  route: INamedEntity;
}

const keyExtractor = (item: IListItemProps) => item.id;

const listDocumentType: IListItem[] = [
  { id: 'order', value: 'Заявка' },
  { id: 'return', value: 'Возврат' },
];

const Visit = ({ item: visit, outlet, contact, route }: IVisitProps) => {
  const navigation = useNavigation() as any;
  const loading = useSelector((state) => state.documents.loading);

  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const { colors } = useTheme();

  const [process, setProcess] = useState(false);

  const dateBegin = useMemo(() => new Date(visit.head.dateBegin), [visit.head.dateBegin]);
  const dateEnd = useMemo(() => (visit.head.dateEnd ? new Date(visit.head.dateEnd) : undefined), [visit.head.dateEnd]);

  // Подразделение по умолчанию
  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data) as INamedEntity | undefined;

  const docs = useSelector((state) => state.documents.list);

  const orderDocs = (docs as IOrderDocument[])?.filter(
    (e) => e.documentType.name === 'order' && e.head.route?.id === route.id && e.head.outlet?.id === outlet.id,
  );

  const orderType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'order');

  const returnDocs = (docs as IReturnDocument[])?.filter(
    (e) => e.documentType.name === 'return' && e.head.route?.id === route.id && e.head.outlet?.id === outlet.id,
  );

  const returnType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'return');

  const handleCloseVisit = useCallback(async () => {
    // TODO Вынести в async actions
    setProcess(true);

    const coords = await getCurrentPosition();

    const date = new Date().toISOString();

    const updatedVisit: IVisitDocument = {
      ...visit,
      head: {
        ...visit.head,
        dateEnd: date,
        endGeoPoint: coords,
      },
      creationDate: visit.creationDate || date,
      editionDate: date,
    };

    const updatedOrders: IOrderDocument[] = orderDocs
      .filter((doc) => doc.status === 'DRAFT')
      ?.map((doc) => ({ ...doc, status: 'READY', creationDate: doc.creationDate || date, editionDate: date }));

    const updatedReturns: IReturnDocument[] = returnDocs
      .filter((doc) => doc.status === 'DRAFT')
      ?.map((doc) => ({ ...doc, status: 'READY', creationDate: doc.creationDate || date, editionDate: date }));

    await docDispatch(documentActions.updateDocuments([updatedVisit, ...updatedOrders, ...updatedReturns]));

    setProcess(false);
  }, [docDispatch, visit, orderDocs, returnDocs]);

  const handleReopenVisit = useCallback(async () => {
    const date = new Date().toISOString();

    const updatedVisit: IVisitDocument = {
      ...visit,
      head: {
        ...visit.head,
        dateEnd: undefined,
        endGeoPoint: undefined,
      },
      editionDate: date,
    };
    await docDispatch(documentActions.updateDocuments([updatedVisit]));
  }, [docDispatch, visit]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleNewOrder = useCallback(() => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    const newOrderDate = new Date().toISOString();
    const newOnDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

    const newOrder: IOrderDocument = {
      id: generateId(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newOrderDate,
      documentType: orderType,
      head: {
        contact,
        outlet,
        route,
        onDate: newOnDate,
        takenOrder: visit.head.takenType,
        depart: defaultDepart,
      },
      lines: [],
      creationDate: newOrderDate,
      editionDate: newOrderDate,
    };

    dispatch(documentActions.addDocument(newOrder));

    navigation.navigate('OrderView', { id: newOrder.id });
  }, [contact, defaultDepart, dispatch, navigation, orderType, outlet, route, visit.head.takenType]);

  const handleNewReturn = useCallback(() => {
    if (!returnType) {
      return Alert.alert('Ошибка!', 'Тип документа для возврата не найден', [{ text: 'OK' }]);
    }

    const newReturnDate = new Date().toISOString();

    const newReturn: IReturnDocument = {
      id: generateId(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newReturnDate,
      documentType: returnType,
      head: {
        contact,
        outlet,
        route,
        reason: 'Брак',
      },
      lines: [],
      creationDate: newReturnDate,
      editionDate: newReturnDate,
    };

    dispatch(documentActions.addDocument(newReturn));

    navigation.navigate('ReturnView', { id: newReturn.id });
  }, [contact, dispatch, navigation, outlet, returnType, route]);

  const visitTextBegin = useMemo(
    () =>
      `Начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
        !dateEnd ? 'тся' : 'лся'
      } ${getTimeProcess(visit.head.dateBegin, visit.head.dateEnd)})`,
    [dateBegin, dateEnd, visit.head.dateBegin, visit.head.dateEnd],
  );

  const visitTextEnd = useMemo(
    () => dateEnd && `Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`,
    [dateEnd],
  );

  const docTypeRef = useRef<BottomSheetModal>(null);

  const handleDismissDocType = useCallback(() => docTypeRef.current?.dismiss(), []);

  const [selectedDocType, setSelectedDocType] = useState(listDocumentType[0]);

  const handleApplyDocType = useCallback(() => {
    docTypeRef.current?.dismiss();

    switch (selectedDocType.id) {
      case 'order':
        return handleNewOrder();
      case 'return':
        return handleNewReturn();
      default:
        return;
    }
  }, [handleNewOrder, handleNewReturn, selectedDocType.id]);

  const handlePresentDocType = useCallback(() => {
    setSelectedDocType(listDocumentType[0]);
    docTypeRef.current?.present();
  }, []);

  const orders: IListItemProps[] = useMemo(() => {
    return orderDocs.map((i) => {
      const creationDate = new Date(i.editionDate || i.creationDate || 0);
      return {
        id: i.id,
        title: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
        documentDate: getDateString(i.documentDate),
        status: i.status,
        subtitle: `${getDateString(creationDate)} ${creationDate.toLocaleTimeString()}`,
        isFromRoute: false,
        lineCount: i.lines.length,
      } as IListItemProps;
    });
  }, [orderDocs]);

  const renderOrderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => {
      const doc = orderDocs.find((r) => r.id === item.id);
      return doc ? (
        <SwipeListItem renderItem={item} item={doc} routeName="OrderView">
          <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
        </SwipeListItem>
      ) : null;
    },
    [navigation, orderDocs],
  );

  const returns: IListItemProps[] = useMemo(() => {
    return returnDocs.map((i) => {
      const creationDate = new Date(i.editionDate || i.creationDate || 0);
      return {
        id: i.id,
        title: `№ ${i.number} от ${getDateString(i.documentDate)}`,
        documentDate: getDateString(i.documentDate),
        status: i.status,
        subtitle: `${getDateString(creationDate)} ${creationDate.toLocaleTimeString()}`,
        isFromRoute: false,
        lineCount: i.lines.length,
      } as IListItemProps;
    });
  }, [returnDocs]);

  const renderReturnItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = returnDocs.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="ReturnView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('ReturnView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

  const readyDocs = useMemo(() => {
    return [
      ...orderDocs.filter((doc) => doc.status === 'READY'),
      ...returnDocs.filter((doc) => doc.status === 'READY'),
    ];
  }, [orderDocs, returnDocs]);

  const handleSendDocs = useSendDocs(readyDocs);

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);
  const orderListStyle = useMemo(() => [{ paddingBottom: returns.length ? 20 : 0 }], [returns.length]);
  const returnViewStyle = useMemo(() => [{ paddingBottom: returns.length > 1 ? 15 : 0 }], [returns.length]);
  const returnListStyle = useMemo(() => [{ paddingBottom: returns.length > 2 ? 20 : 0 }], [returns.length]);

  return (
    <>
      <View style={localStyles.container}>
        <InfoBlock colorLabel="#7d0656" title="Визит">
          <>
            <Text style={textStyle}>{visitTextBegin}</Text>
            {dateEnd && <Text style={textStyle}>{visitTextEnd}</Text>}
            {
              <>
                {!dateEnd ? (
                  <PrimeButton
                    icon={!process ? 'stop-circle-outline' : 'block-helper'}
                    onPress={handleCloseVisit}
                    outlined={true}
                    disabled={process}
                  >
                    Завершить визит
                  </PrimeButton>
                ) : (
                  readyDocs.length <= 0 && (
                    <PrimeButton
                      icon={!process ? 'play-circle-outline' : 'block-helper'}
                      onPress={handleReopenVisit}
                      outlined={true}
                      disabled={process}
                    >
                      Возообновить визит
                    </PrimeButton>
                  )
                )}
              </>
            }
          </>
        </InfoBlock>
        {orders.length > 0 && (
          <View style={localStyles.orderView}>
            <InfoBlock colorLabel="#567d06" title="Заявки">
              <View style={[localStyles.list, orderListStyle]}>
                <FlatList
                  data={orders}
                  keyExtractor={keyExtractor}
                  renderItem={renderOrderItem}
                  scrollEventThrottle={400}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>
            </InfoBlock>
          </View>
        )}
        {returnDocs.length > 0 && (
          <View style={[localStyles.returnView, returnViewStyle]}>
            <InfoBlock colorLabel={'#c98f10'} title="Возвраты">
              <View style={[localStyles.list, returnListStyle]}>
                <FlatList
                  data={returns}
                  keyExtractor={keyExtractor}
                  renderItem={renderReturnItem}
                  scrollEventThrottle={400}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>
            </InfoBlock>
          </View>
        )}
      </View>
      {!dateEnd ? (
        <PrimeButton icon="plus-circle-outline" onPress={handlePresentDocType}>
          Добавить документ
        </PrimeButton>
      ) : (
        readyDocs.length > 0 && (
          <PrimeButton
            icon={!loading ? 'file-send' : 'block-helper'}
            onPress={handleSendDocs}
            disabled={loading}
            loadIcon={loading}
          >
            Отправить
          </PrimeButton>
        )
      )}
      <BottomSheet
        sheetRef={docTypeRef}
        title={'Тип документа'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissDocType}
        onApply={handleApplyDocType}
      >
        <RadioGroup options={listDocumentType} onChange={setSelectedDocType} activeButtonId={selectedDocType?.id} />
      </BottomSheet>
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderView: {
    flex: 1,
    display: 'flex',
  },
  returnView: {
    flex: 1,
    display: 'flex',
    paddingTop: 25,
  },
  list: {
    maxHeight: 180,
  },
});

export default Visit;
