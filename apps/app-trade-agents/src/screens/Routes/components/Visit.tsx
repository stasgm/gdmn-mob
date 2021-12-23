import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors, useSelector } from '@lib/store';
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
  SwipeListItem,
} from '@lib/mobile-ui';
import { useSendDocs } from '@lib/mobile-app';

import { useDispatch } from '../../../store';
import { IOrderDocument, IReturnDocument, IVisitDocument } from '../../../store/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';
import { getCurrentPosition } from '../../../utils/expoFunctions';
import { getDateString } from '../../../utils/helpers';
import { useTheme } from 'react-native-paper';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteDetails'>;

interface IVisitProps {
  item: IVisitDocument;
  outlet: INamedEntity;
  contact: INamedEntity;
  route: INamedEntity;
}

const Visit = ({ item: visit, outlet, contact, route }: IVisitProps) => {
  const navigation = useNavigation<RouteLineProp>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [process, setProcess] = useState(false);

  const dateBegin = new Date(visit.head.dateBegin);
  const dateEnd = visit.head.dateEnd ? new Date(visit.head.dateEnd) : undefined;

  const { loading } = useSelector((state) => state.app);

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

  const timeProcess = () => {
    // TODO Вынести в helpers
    const diffMinutes = Math.floor(
      ((visit.head.dateEnd ? Date.parse(visit.head.dateEnd) : Date.now()) - Date.parse(visit.head.dateBegin)) / 60000,
    );
    const hour = Math.floor(diffMinutes / 60);
    return `${hour} часов ${diffMinutes - hour * 60} минут`;
  };

  const twoDigits = (value: number) => {
    // TODO Вынести в helpers
    return value >= 10 ? value : `0${value}`;
  };

  const handleCloseVisit = async () => {
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

    dispatch(documentActions.updateDocuments([updatedVisit, ...updatedOrders, ...updatedReturns]));

    setProcess(false);
  };

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
  } ${timeProcess()})`;
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
        <ScreenListItem {...item} routeName="OrderView" />
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
        <ScreenListItem {...item} routeName="ReturnView" />
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
        <InfoBlock colorLabel='#7d0656' title="Визит">
          <>
            <Text>{visitTextBegin}</Text>
            {dateEnd && <Text>{visitTextEnd}</Text>}
            {process ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {!dateEnd && (
                  <PrimeButton icon="stop-circle-outline" onPress={handleCloseVisit} outlined={true}>
                    Завершить визит
                  </PrimeButton>
                )}
              </>
            )}
          </>
        </InfoBlock>
        {orders.length !== 0 && (
          <InfoBlock colorLabel='#567d06' title="Заявки">
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
        readyDocs?.length > 0 &&
        (loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <PrimeButton icon="file-send" onPress={handleSendDocs}>
            Отправить
          </PrimeButton>
        ))
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
