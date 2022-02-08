import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';
import { docSelectors, documentActions, refSelectors, useDocThunkDispatch, useSelector } from '@lib/store';
import { IDocumentType, INamedEntity } from '@lib/types';
import { IListItem } from '@lib/mobile-types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BackButton,
  BottomSheet,
  InfoBlock,
  ItemSeparator,
  PrimeButton,
  RadioGroup,
  ScreenListItem,
  IListItemProps,
} from '@lib/mobile-ui';
import { useSendDocs } from '@lib/mobile-app';

import { useTheme } from 'react-native-paper';

import { useDispatch } from '../../../store';
import { IOrderDocument, IReturnDocument, IVisitDocument } from '../../../store/types';
import { getCurrentPosition } from '../../../utils/expoFunctions';
import { getDateString, getTimeProcess, twoDigits } from '../../../utils/helpers';
import SwipeListItem from '../../../components/SwipeListItem';

interface IVisitProps {
  item: IVisitDocument;
  outlet: INamedEntity;
  contact: INamedEntity;
  route: INamedEntity;
}

const Visit = ({ item: visit, outlet, contact, route }: IVisitProps) => {
  const navigation = useNavigation();
  const loading = useSelector((state) => state.documents.loading);

  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const { colors } = useTheme();

  const [process, setProcess] = useState(false);

  const dateBegin = new Date(visit.head.dateBegin);
  const dateEnd = visit.head.dateEnd ? new Date(visit.head.dateEnd) : undefined;

  // Подразделение по умолчанию
  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data) as INamedEntity | undefined;

  const orderDocs = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((e) => e.head.route?.id === route.id && e.head.outlet.id === outlet.id);

  const orderType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'order');

  const returnDocs = docSelectors
    .selectByDocType<IReturnDocument>('return')
    ?.filter((e) => e.head.route?.id === route.id && e.head.outlet.id === outlet.id);

  const returnType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === 'return');

  // useEffect(() => {
  //   // let cleanupFunction = true;

  //   const closeVisit = async () => {
  //     if (process) {
  //       // try {
  //       const coords = await getCurrentPosition();
  //       // } catch (e) {
  //       //   // setMessage(e.message);
  //       //   // setBarVisible(true);
  //       // }

  //       const date = new Date().toISOString();

  //       const updatedVisit: IVisitDocument = {
  //         ...visit,
  //         head: {
  //           ...visit.head,
  //           dateEnd: date,
  //           endGeoPoint: coords,
  //         },
  //         creationDate: visit.creationDate || date,
  //         editionDate: date,
  //       };

  //       const updatedOrders: IOrderDocument[] = orderDocs
  //         .filter((doc) => doc.status === 'DRAFT')
  //         ?.map((doc) => ({ ...doc, status: 'READY', creationDate: doc.creationDate || date, editionDate: date }));

  //       const updatedReturns: IReturnDocument[] = returnDocs
  //         .filter((doc) => doc.status === 'DRAFT')
  //         ?.map((doc) => ({ ...doc, status: 'READY', creationDate: doc.creationDate || date, editionDate: date }));

  //       console.log('docs', [updatedVisit, ...updatedOrders, ...updatedReturns].length);
  //       await docDispatch(documentActions.updateDocuments([updatedVisit, ...updatedOrders, ...updatedReturns]));
  //       // if (cleanupFunction) {
  //       setProcess(false);
  //       // }
  //     }
  //   }

  //   closeVisit().catch((err) => {
  //     docDispatch(documentActions.setLoadingError(err || 'При закрытии визита произошла ошибка'));
  //   });

  //   // return () => { cleanupFunction = false };
  // }, [process]);

  const handleCloseVisit = useCallback(async () => {
    // TODO Вынести в async actions
    setProcess(true);

    // let coords: ICoords;

    // try {
    const coords = await getCurrentPosition();
    // } catch (e) {
    //   // setMessage(e.message);
    //   // setBarVisible(true);
    // }

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

    console.log('docs', [updatedVisit, ...updatedOrders, ...updatedReturns].length);
    await docDispatch(documentActions.updateDocuments([updatedVisit, ...updatedOrders, ...updatedReturns]));
    // console.log('docs 2');
    setProcess(false);
  }, [docDispatch, visit, orderDocs, returnDocs]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const handleNewOrder = () => {
    if (!orderType) {
      return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
    }

    const newOrderDate = new Date().toISOString();

    const newOrder: IOrderDocument = {
      id: uuid(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newOrderDate,
      documentType: orderType,
      head: {
        contact,
        outlet,
        route,
        onDate: newOrderDate,
        takenOrder: visit.head.takenType,
        depart: defaultDepart,
      },
      lines: [],
      creationDate: newOrderDate,
      editionDate: newOrderDate,
    };

    dispatch(documentActions.addDocument(newOrder));

    navigation.navigate('OrderView', { id: newOrder.id });
  };

  const handleNewReturn = () => {
    if (!returnType) {
      return Alert.alert('Ошибка!', 'Тип документа для возврата не найден', [{ text: 'OK' }]);
    }

    const newReturnDate = new Date().toISOString();

    const newReturn: IReturnDocument = {
      id: uuid(),
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newReturnDate,
      documentType: returnType,
      head: {
        contact,
        outlet,
        // depart: deprt1,
        route,
        reason: 'Брак',
      },
      lines: [],
      creationDate: newReturnDate,
      editionDate: newReturnDate,
    };

    dispatch(documentActions.addDocument(newReturn));

    navigation.navigate('ReturnView', { id: newReturn.id });
  };

  const visitTextBegin = `Начат в ${dateBegin.getHours()}:${twoDigits(dateBegin.getMinutes())} (дли${
    !dateEnd ? 'тся' : 'лся'
  } ${getTimeProcess(visit.head.dateBegin, visit.head.dateEnd)})`;
  const visitTextEnd = dateEnd && `Завершён в ${dateEnd.getHours()}:${twoDigits(dateEnd.getMinutes())}`;

  const docTypeRef = useRef<BottomSheetModal>(null);
  const handleDismissDocType = () => docTypeRef.current?.dismiss();

  const handleApplyDocType = () => {
    docTypeRef.current?.dismiss();

    switch (selectedDocType.id) {
      case 'order':
        return handleNewOrder();
      case 'return':
        return handleNewReturn();
      default:
        return;
    }
  };

  const listDocumentType: IListItem[] = [
    { id: 'order', value: 'Заявка' },
    { id: 'return', value: 'Возврат' },
  ];

  const [selectedDocType, setSelectedDocType] = useState(listDocumentType[0]);

  const handlePresentDocType = () => {
    setSelectedDocType(listDocumentType[0]);
    docTypeRef.current?.present();
  };

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

  const renderOrderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = orderDocs.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} edit={true} copy={true} del={true} routeName="OrderView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

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
      <SwipeListItem renderItem={item} item={doc} edit={true} copy={true} del={true} routeName="ReturnView">
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

  return (
    <>
      <View style={localStyles.container}>
        <InfoBlock colorLabel="#7d0656" title="Визит">
          <>
            <Text>{visitTextBegin}</Text>
            {dateEnd && <Text>{visitTextEnd}</Text>}
            {
              <>
                {!dateEnd && (
                  <PrimeButton
                    icon={!process ? 'stop-circle-outline' : 'block-helper'}
                    onPress={handleCloseVisit}
                    outlined={true}
                    disabled={process}
                  >
                    Завершить визит
                  </PrimeButton>
                )}
              </>
            }
          </>
        </InfoBlock>
        {orders.length !== 0 && (
          <InfoBlock colorLabel="#567d06" title="Заявки">
            <FlatList
              data={orders}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderOrderItem}
              scrollEventThrottle={400}
              ItemSeparatorComponent={ItemSeparator}
            />
          </InfoBlock>
        )}
        {returnDocs.length !== 0 && (
          <InfoBlock colorLabel={colors.error} title="Возвраты">
            <FlatList
              data={returns}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderReturnItem}
              scrollEventThrottle={400}
              ItemSeparatorComponent={ItemSeparator}
            />
          </InfoBlock>
        )}
      </View>
      {!dateEnd ? (
        <PrimeButton icon="plus-circle-outline" onPress={handlePresentDocType}>
          Добавить документ
        </PrimeButton>
      ) : (
        readyDocs?.length > 0 && (
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
        <RadioGroup
          options={listDocumentType}
          onChange={(option) => setSelectedDocType(option)}
          activeButtonId={selectedDocType?.id}
        />
      </BottomSheet>
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
  },
});

export default Visit;
