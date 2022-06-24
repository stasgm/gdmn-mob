import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocument } from '@lib/types';

import { IOrderLine, IOtvesDocument, ITempDocument } from '../../store/types';

import { OrderStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SwipeLineItem from '../../components/SwipeLineItem';

import { navBackButton } from '../../components/navigateOptions';

import { getBarcode } from '../../utils/helpers';
import { IGood } from '../../store/app/types';

import BarcodeDialog from '../../components/BarcodeDialog';

import OrderItem from './components/OrderItem';

const keyExtractor = (item: IOrderLine) => item.id;

const OrderViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OrderView'>>();
  const id = useRoute<RouteProp<OrderStackParamList, 'OrderView'>>().params?.id;

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const [del, setDel] = useState(false);

  const order = docSelectors.selectByDocId<ITempDocument>(id);
  const otvesId =
    docSelectors.selectByDocType<IOtvesDocument>('otves').find((item) => item.head?.barcode === order?.head?.barcode)
      ?.id || '-1';

  const isBlocked = order?.status !== 'DRAFT';

  // const handleAddOrderLine = useCallback(() => {
  //   navigation.navigate('SelectGroupItem', {
  //     docId: id,
  //   });
  // }, [navigation, id]);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(false);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const handleGetBarcode = useCallback(
    (brc: string) => {
      const barc = getBarcode(brc);

      const good = goods.find((item) => item.shcode === barc.shcode);

      if (good) {
        const barcodeItem = {
          good: { id: good.id, name: good.name, shcode: good.shcode },
          id: generateId(),
          weight: barc.weight,
          barcode: barc.barcode,
          workDate: barc.workDate,
          numReceived: barc.numReceived,
        };
        setError(false);
        navigation.navigate('OrderLine', {
          mode: 0,
          docId: otvesId,
          item: barcodeItem,
          tempId: id,
        });
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [goods, id, navigation, otvesId],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismisDialog = () => {
    setVisibleDialog(false);
  };

  const handleOtvesDoc = useCallback(() => {
    navigation.navigate('OtvesView', {
      id: otvesId,
    });
  }, [navigation, otvesId]);

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

  const handleDelete = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          const res1 = await docDispatch(documentActions.removeDocument(otvesId));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS' && res1.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setDel(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation, otvesId]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanGood', { docId: otvesId, tempId: id });
  }, [navigation, id, otvesId]);

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = order?.lines[order?.lines.length - 1].id;

    dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
  }, [dispatch, order?.lines, id]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Перейти на внешний документ',
        onPress: handleOtvesDoc,
      },
      {
        title: 'Найти штрих-код',
        onPress: handleShowDialog,
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
  }, [showActionSheet, handleOtvesDoc, handleEditOrderHead, handleCopyOrder, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <ScanButton onPress={handleDoScan} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleDoScan, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setError(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: IOrderLine }) => (
      <SwipeLineItem docId={order?.id} item={item} readonly={isBlocked} copy={false} routeName="OrderLine">
        <OrderItem docId={order?.id} item={item} readonly={isBlocked} />
      </SwipeLineItem>
    ),
    [isBlocked, order?.id],
  );

  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

  if (del) {
    return (
      <View style={styles.container}>
        <View style={localStyles.del}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colorStyle} />
        </View>
      </View>
    );
  } else {
    if (!order) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(order?.status || 'DRAFT')}
        title={order?.head?.outlet?.name}
        onPress={handleEditOrderHead}
        disabled={!['DRAFT', 'READY'].includes(order.status)}
      >
        <View style={localStyles.infoBlock}>
          <Text style={textStyle}>
            {`№ ${order.number} от ${getDateString(order.documentDate)} на ${getDateString(order?.head?.onDate)}`}
          </Text>
          <View style={styles.rowCenter}>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </View>
      </InfoBlock>
      <FlatList
        data={order?.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      <BarcodeDialog
        visibleDialog={visibleDialog}
        onDismissDialog={handleDismisDialog}
        barcode={barcode}
        onChangeBarcode={setBarcode}
        onDismiss={handleDismissBarcode}
        onSearch={handleSearchBarcode}
        error={error}
      />
    </View>
  );
};

export default OrderViewScreen;

const localStyles = StyleSheet.create({
  del: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    flexDirection: 'column',
  },
});
