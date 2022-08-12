import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, View, FlatList } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  AddButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SendButton,
  MediumText,
  AppActivityIndicator,
  DeleteButton,
  CloseButton,
  LargeText,
} from '@lib/mobile-ui';

import { formatValue, generateId, getDateString, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { IDocument } from '@lib/types';

import { sleep } from '@lib/client-api';

import { IDebt, IOrderDocument, IOrderLine, IOutlet } from '../../store/types';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import { navBackButton } from '../../components/navigateOptions';

import OrderItem from './components/OrderItem';
import OrderTotal from './components/OrderTotal';

const OrderViewScreen = () => {
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  const dispatch = useDispatch();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting' | 'sent'>('idle');
  const [delList, setDelList] = useState<string[]>([]);

  const [groupp, setGroup] = useState(false);

  const order = docSelectors.selectByDocId<IOrderDocument>(id);

  const isBlocked = useMemo(() => order?.status !== 'DRAFT', [order?.status]);

  const debt = refSelectors.selectByRefId<IDebt>('debt', order?.head?.contact.id);

  const { colors } = useTheme();

  const debtTextStyle = { color: debt?.saldoDebt && debt?.saldoDebt > 0 ? colors.notification : colors.text };

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

    const newDoc: IDocument = {
      ...order,
      id: newId,
      number: 'б\\н',
      status: 'DRAFT',
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
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation]);

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

  const handleSendDoc = useSendDocs([order]);

  useEffect(() => {
    if (screenState === 'sending') {
      Alert.alert('Вы уверены, что хотите отправить документ?', '', [
        {
          text: 'Да',
          onPress: () => {
            handleSendDoc();
            setScreenState('sent');
          },
        },
        {
          text: 'Отмена',
          onPress: () => {
            setScreenState('idle');
          },
        },
      ]);
    } else if (screenState === 'sent' && order?.head?.route?.id) {
      setScreenState('idle');
      navigation.goBack();
    }
  }, [handleSendDoc, navigation, order?.head?.route?.id, screenState]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
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
    ]);
  }, [showActionSheet, handleAddOrderLine, handleEditOrderHead, handleCopyOrder, handleDelete]);

  const renderRight = useCallback(
    () =>
      isBlocked ? (
        order?.status === 'READY' && (
          <SendButton onPress={() => setScreenState('sending')} disabled={screenState !== 'idle'} />
        )
      ) : (
        <View style={styles.buttons}>
          {delList.length > 0 ? (
            <DeleteButton onPress={handleDeleteDocLine} />
          ) : (
            <>
              <SendButton onPress={() => setScreenState('sending')} disabled={screenState !== 'idle'} />
              <AddButton onPress={handleAddOrderLine} disabled={screenState !== 'idle'} />
              <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
            </>
          )}
        </View>
      ),
    [isBlocked, order?.status, screenState, delList.length, handleDeleteDocLine, handleAddOrderLine, actionsMenu],
  );

  const renderLeft = useCallback(
    () => !isBlocked && delList.length > 0 && <CloseButton onPress={() => setDelList([])} />,
    [delList.length, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: delList.length > 0 ? renderLeft : navBackButton,
      headerRight: renderRight,
      title: delList.length > 0 ? `Выделено позиций: ${delList.length}` : 'Заявка',
    });
  }, [delList.length, navigation, renderLeft, renderRight]);

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
          isDelList={delList.length > 0 ? true : false}
        />
      );
    },
    [delList, handleAddDeletelList, handlePressOrderLine],
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
          disabled={delList.length > 0 || !['DRAFT', 'READY'].includes(order.status)}
          // disabled={delList.length > 0 || !['DRAFT', 'READY'].includes(order.status)}
          isBlocked={isBlocked}
        >
          <View style={styles.directionColumn}>
            <MediumText>{`№ ${order.number} от ${getDateString(order.documentDate)} на ${getDateString(
              order.head?.onDate,
            )}`}</MediumText>
            <MediumText>Адрес: {address}</MediumText>
            <MediumText style={debtTextStyle}>
              {(debt?.saldo && debt?.saldo < 0
                ? `Предоплата: ${formatValue({ type: 'number', decimals: 2 }, Math.abs(debt?.saldo) ?? 0)}`
                : `Задолженность: ${formatValue({ type: 'number', decimals: 2 }, debt?.saldo ?? 0)}`) || 0}
            </MediumText>
            <MediumText>
              {`Просроченная задолженность: ${formatValue({ type: 'number', decimals: 2 }, debt?.saldoDebt ?? 0)}` || 0}
            </MediumText>
            <View style={styles.rowCenter}>
              <MediumText>Количество дней: {debt?.dayLeft || 0}</MediumText>
            </View>
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
          maxToRenderPerBatch={6} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
          ItemSeparatorComponent={ItemSeparator}
        />

        {order.lines.length ? (
          <OrderTotal onPress={() => setGroup(!groupp)} isGroupVisible={groupp} order={order} />
        ) : null}
      </View>
    </>
  );
};

export default OrderViewScreen;
