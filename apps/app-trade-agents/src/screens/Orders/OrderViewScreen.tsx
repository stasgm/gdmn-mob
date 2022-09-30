import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View, FlatList } from 'react-native';
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

import { ScreenState } from '@lib/types';

import { sleep } from '@lib/client-api';

import { useTheme } from 'react-native-paper';

import { IDebt, IOrderDocument, IOrderLine, IOutlet } from '../../store/types';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import OrderItem from './components/OrderItem';
import OrderTotal from './components/OrderTotal';

const OrderViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

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
    navigation.navigate('SelectGroupItem', {
      docId: id,
    });
  }, [id, navigation]);

  const handleEditOrderHead = useCallback(() => {
    navigation.navigate('OrderEdit', { id });
  }, [navigation, id]);

  const handleCopyOrder = useCallback(() => {
    const newDocDate = new Date().toISOString();
    const newId = generateId();

    const newDoc: IOrderDocument = {
      ...order,
      id: newId,
      number: 'б\\н',
      status: 'DRAFT',
      head: { ...order?.head, route: undefined },
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    docDispatch(documentActions.addDocument(newDoc));

    navigation.navigate('OrderView', { id: newId });
  }, [order, docDispatch, navigation]);

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

  const sendDoc = useSendDocs([order]);

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
    dispatch(
      documentActions.updateDocument({
        docId: id,
        document: { ...order, status: 'READY' },
      }),
    );
    navigation.goBack();
  }, [dispatch, id, navigation, order]);

  useEffect(() => {
    if (screenState === 'sent' || screenState === 'deleted') {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [navigation, screenState]);

  const actionsMenu = useCallback(() => {
    showActionSheet(
      isBlocked
        ? [
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
  }, [showActionSheet, isBlocked, handleCopyOrder, handleDelete, handleAddOrderLine, handleEditOrderHead]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        order?.status === 'READY' ? (
          <View style={styles.buttons}>
            <SendButton onPress={handleSendDocument} disabled={screenState !== 'idle'} />
            <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
          </View>
        ) : (
          order?.status !== 'SENT' && <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        )
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

  const handlePressOrderLine = useCallback(
    (item: IOrderLine) => !isBlocked && navigation.navigate('OrderLine', { mode: 1, docId: id, item }),
    [id, isBlocked, navigation],
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

  if (screenState === 'deleting') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <LargeText>Удаление документа...</LargeText>
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
        <InfoBlock
          colorLabel={getStatusColor(order?.status || 'DRAFT')}
          title={order.head?.outlet?.name}
          onPress={handleEditOrderHead}
          disabled={isDelList || !['DRAFT', 'READY'].includes(order.status)}
          isBlocked={isBlocked}
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
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={100}
          windowSize={7}
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
