import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  AddButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  SendButton,
  MediumText,
  AppActivityIndicator,
  DeleteButton,
  CloseButton,
  LargeText,
  navBackButton,
  ItemSeparator,
  SaveDocument,
} from '@lib/mobile-ui';

import { formatValue, generateId, getDateString, useSendDocs, keyExtractor } from '@lib/mobile-app';

import { INamedEntity, ScreenState } from '@lib/types';

import { sleep } from '@lib/client-api';

import { useTheme } from 'react-native-paper';

import {
  IDebt,
  IOrderDocument,
  IOrderLine,
  IOutlet,
  IRouteDocument,
  IVisitDocument,
  visitDocumentType,
} from '../../store/types';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import { getNextDocNumber } from '../../utils/helpers';

import { getCurrentPosition } from '../../utils/expoFunctions';

import { ICoords } from '../../store/geo/types';

import OrderItem from './components/OrderItem';
import OrderTotal from './components/OrderTotal';
import OrderLineEdit, { IOrderItemLine } from './components/OrderLineEdit';

const OrderViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const { id, routeId } = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params;

  const dispatch = useDispatch();

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [delList, setDelList] = useState<string[]>([]);
  const isDelList = !!Object.keys(delList).length;

  const [isGroupVisible, setIsGroupVisible] = useState(true);

  const order = docSelectors.selectByDocId<IOrderDocument>(id);

  const isBlocked = order?.status !== 'DRAFT';

  const debt = refSelectors.selectByRefId<IDebt>('debt', order?.head?.contact.id);

  const { colors } = useTheme();

  const debtTextStyle = { color: debt?.saldoDebt && debt?.saldoDebt > 0 ? colors.error : colors.text };

  const address = refSelectors.selectByRefId<IOutlet>('outlet', order?.head?.outlet.id)?.address;

  const handleAddOrderLine = useCallback(() => {
    navigation.navigate('SelectGood', {
      docId: id,
    });
  }, [id, navigation]);

  const handleEditOrderHead = useCallback(() => {
    navigation.navigate('OrderEdit', { id });
  }, [navigation, id]);

  const orderDocs = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((doc) =>
      routeId ? doc.head?.route?.id === routeId && doc.head.outlet?.id === order?.head.outlet?.id : true,
    );

  const route = docSelectors.selectByDocId<IRouteDocument>(routeId || order?.head?.route?.id);

  const routeLineId = route?.lines.find((i) => i.outlet.id === order?.head.outlet.id)?.id;

  const visit = docSelectors.selectByDocType<IVisitDocument>('visit')?.find((e) => e.head.routeLineId === routeLineId);

  const handleCopyOrder = useCallback(async () => {
    if (!order) {
      return;
    }
    setScreenState('copying');
    await sleep(1);
    const newDocDate = new Date().toISOString();
    const newId = generateId();

    const newNumber = getNextDocNumber(orderDocs);

    const newDoc: IOrderDocument = {
      ...order,
      id: newId,
      number: newNumber,
      status: 'DRAFT',
      head: {
        ...order.head,
        route: routeId ? ({ id: routeId, name: '' } as INamedEntity) : undefined,
        onDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    if (routeId && routeLineId && !orderDocs.length) {
      let coords: ICoords | undefined;

      try {
        if (!orderDocs.find((i) => i.head.route)) {
          coords = await getCurrentPosition();

          const date = new Date().toISOString();
          if (visit) {
            const updatedVisit: IVisitDocument = {
              ...visit,
              documentDate: date,
              head: {
                ...visit.head,
                dateBegin: date,
                beginGeoPoint: coords,
              },
              creationDate: date,
              editionDate: date,
            };
            dispatch(documentActions.updateDocument({ docId: visit.id, document: updatedVisit }));
          } else {
            const visitId = generateId();

            const newVisit: IVisitDocument = {
              id: visitId,
              documentType: visitDocumentType,
              number: visitId,
              documentDate: date,
              status: 'DRAFT',
              head: {
                routeLineId: routeLineId,
                dateBegin: date,
                beginGeoPoint: coords,
                takenType: 'ON_PLACE',
              },
              creationDate: date,
              editionDate: date,
            };
            dispatch(documentActions.addDocument(newVisit));
          }

          dispatch(documentActions.addDocument(newDoc));
        }
        navigation.navigate('OrderView', { id: newId, routeId });
      } catch (e) {
        setScreenState('idle');
      }
    } else {
      docDispatch(documentActions.addDocument(newDoc));
      navigation.navigate('OrderView', routeId ? { id: newId, routeId } : { id: newId });
    }
    setScreenState('copied');
  }, [orderDocs, order, routeId, routeLineId, navigation, visit, dispatch, docDispatch]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setScreenState('deleting');
          await sleep(1);
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setScreenState('deleted');
          } else {
            setScreenState('idle');
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id]);

  const handleAddDeletelList = useCallback(
    (lineId: string, checkedId: string) => {
      if (checkedId) {
        const newList = delList.filter((i) => i !== checkedId);
        setDelList(newList);
      } else {
        setDelList([...delList, lineId]);
      }
    },
    [delList],
  );

  const handleDeleteDocLine = useCallback(() => {
    Alert.alert('Вы уверены, что хотите удалить позиции документа?', '', [
      {
        text: 'Да',
        onPress: () => {
          for (const item of delList) {
            dispatch(documentActions.removeDocumentLine({ docId: id, lineId: item }));
          }
          setDelList([]);
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [delList, dispatch, id]);

  const sendDoc = useSendDocs(order ? [order] : []);

  const handleSendDocument = useCallback(() => {
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: () => {
          setScreenState('sending');
          sendDoc();
          setScreenState('sent');
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [sendDoc]);

  const handleSaveDocument = useCallback(() => {
    if (!order) {
      return;
    }
    dispatch(
      documentActions.updateDocument({
        docId: id,
        document: { ...order, status: 'READY' },
      }),
    );
    navigation.goBack();
  }, [dispatch, id, navigation, order]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted' || screenState === 'copied') {
      setScreenState('idle');
      if (screenState !== 'copied') {
        navigation.goBack();
      }
    }
  }, [navigation, screenState]);

  const actionsMenu = useCallback(() => {
    showActionSheet(
      isBlocked
        ? order?.status === 'SENT'
          ? [
              {
                title: 'Копировать заявку',
                onPress: handleCopyOrder,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ]
          : [
              {
                title: 'Копировать заявку',
                onPress: handleCopyOrder,
              },
              {
                title: 'Удалить заявку',
                type: 'destructive',
                onPress: handleDelete,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ]
        : [
            {
              title: 'Добавить товар',
              onPress: handleAddOrderLine,
            },
            {
              title: 'Редактировать данные',
              onPress: handleEditOrderHead,
            },
            {
              title: 'Копировать заявку',
              onPress: handleCopyOrder,
            },
            {
              title: 'Удалить заявку',
              type: 'destructive',
              onPress: handleDelete,
            },
            {
              title: 'Отмена',
              type: 'cancel',
            },
          ],
    );
  }, [
    showActionSheet,
    isBlocked,
    order?.status,
    handleCopyOrder,
    handleDelete,
    handleAddOrderLine,
    handleEditOrderHead,
  ]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        <View style={styles.buttons}>
          {order?.status === 'READY' && <SendButton onPress={handleSendDocument} disabled={screenState !== 'idle'} />}
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ) : (
        <View style={styles.buttons}>
          {isDelList ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              {order?.status === 'DRAFT' && (
                <SaveDocument onPress={handleSaveDocument} disabled={screenState !== 'idle'} />
              )}
              <SendButton onPress={handleSendDocument} disabled={screenState !== 'idle'} />
              <AddButton onPress={handleAddOrderLine} disabled={screenState !== 'idle'} />
              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [
      isBlocked,
      order?.status,
      handleSendDocument,
      screenState,
      handleSaveDocument,
      isDelList,
      handleDeleteDocLine,
      handleAddOrderLine,
      actionsMenu,
    ],
  );

  const renderLeft = useCallback(
    () => !isBlocked && isDelList && <CloseButton onPress={() => setDelList([])} />,
    [isDelList, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: isDelList ? `Выделено позиций: ${delList.length}` : 'Заявка',
    });
  }, [delList.length, isDelList, navigation, renderLeft, renderRight]);

  const [orderLine, setOrderLine] = useState<IOrderItemLine | undefined>();

  const handlePressOrderLine = useCallback(
    (item: IOrderLine) => !isBlocked && setOrderLine({ mode: 1, docId: id, item }),
    [id, isBlocked],
  );

  const renderItem = useCallback(
    ({ item }: { item: IOrderLine }) => {
      const checkedId = delList.find((i) => i === item.id) || '';
      return (
        <OrderItem
          key={item.id}
          item={item}
          onPress={() => handlePressOrderLine(item)}
          isChecked={checkedId ? true : false}
          onLongPress={() => handleAddDeletelList(item.id, checkedId)}
          isDelList={isDelList}
        />
      );
    },
    [delList, handleAddDeletelList, handlePressOrderLine, isDelList],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting' || screenState === 'copying') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>{screenState === 'deleting' ? 'Удаление документа...' : 'Копирование документа...'}</LargeText>
          <AppActivityIndicator style={{}} />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {orderLine && <OrderLineEdit orderLine={orderLine} onDismiss={() => setOrderLine(undefined)} />}
        <InfoBlock
          colorLabel={getStatusColor(order?.status || 'DRAFT')}
          title={order.head?.outlet?.name}
          onPress={handleEditOrderHead}
          disabled={isDelList || !['DRAFT', 'READY'].includes(order.status)}
          isBlocked={isBlocked}
          isFromRoute={order.head.route ? true : false}
        >
          <View style={styles.directionColumn}>
            <MediumText>Адрес: {address}</MediumText>
            <MediumText>{`№ ${order.number} от ${getDateString(order.documentDate)} на ${getDateString(
              order.head?.onDate,
            )}`}</MediumText>
            <MediumText style={debtTextStyle}>
              {(!!debt?.saldo && debt.saldo < 0
                ? `Предоплата: ${formatValue({ type: 'currency', decimals: 2 }, Math.abs(debt.saldo))}`
                : `Задолженность: ${formatValue({ type: 'currency', decimals: 2 }, debt?.saldo ?? 0)}`) || 0}
            </MediumText>
            {!!debt?.saldoDebt && (
              <MediumText>
                {`Просрочено: ${formatValue({ type: 'currency', decimals: 2 }, debt.saldoDebt)}, ${
                  debt.dayLeft || 0
                } дн.`}
              </MediumText>
            )}
            {order.head.comment ? (
              <View style={styles.rowCenter}>
                <MediumText>Комментарий: {order.head.comment || ''}</MediumText>
              </View>
            ) : null}
          </View>
        </InfoBlock>
        <FlatList
          data={order.lines}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={100}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
      {!!order.lines.length && (
        <OrderTotal onPress={() => setIsGroupVisible(!isGroupVisible)} isGroupVisible={isGroupVisible} order={order} />
      )}
    </>
  );
};

export default OrderViewScreen;
