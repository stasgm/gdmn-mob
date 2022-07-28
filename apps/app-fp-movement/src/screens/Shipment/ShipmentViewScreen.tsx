import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, View, FlatList, TouchableHighlight, TextInput, ListRenderItem } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  AppActivityIndicator,
  MediumText,
  LargeText,
  BackButton,
  ListItemLine,
  SendButton,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { generateId, getDateString, round, useSendDocs } from '@lib/mobile-app';

import { IShipmentDocument, IShipmentLine, ITempLine } from '../../store/types';

import { ShipmentStackParamList } from '../../navigation/Root/types';

import { getStatusColor, lineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';

import { IGood } from '../../store/app/types';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../../store/index';

import { getBarcode } from '../../utils/helpers';

import ShipmentTotal from './components/ShipmentTotal';

const keyExtractor = (item: IShipmentLine | ITempLine) => item.id;

const ShipmentViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentView'>>();
  const id = useRoute<RouteProp<ShipmentStackParamList, 'ShipmentView'>>().params?.id;
  const dispatch = useDispatch();
  const fpDispatch = useFpDispatch();

  const [lineType, setLineType] = useState(lineTypes[1].id);

  // const [deleting, setDeleting] = useState(false);

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(id);
  const shipmentLines = useMemo(
    () => shipment?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)),
    [shipment?.lines],
  );

  const tempOrder = useFpSelector((state) => state.fpMovement.list).find((i) => i.orderId === shipment?.head?.orderId);
  const tempOrderLines = tempOrder?.lines?.filter((i) => i.weight > 0) as ITempLine[];

  const isBlocked = shipment?.status !== 'DRAFT';

  const shipmentLineSum = shipmentLines?.reduce((sum, line) => sum + line.weight, 0) || 0;
  const tempLineSum = tempOrderLines?.reduce((sum, line) => sum + line.weight, 0) || 0;

  const handleEditShipmentHead = useCallback(() => navigation.navigate('ShipmentEdit', { id }), [navigation, id]);

  const handleDeleteShipment = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            fpDispatch(fpMovementActions.removeTempOrder(shipment?.head.orderId));
            setScreenState('deleting');
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, fpDispatch, id, navigation, shipment?.head.orderId]);

  const hanldeCancelLastScan = useCallback(() => {
    if (shipmentLines.length) {
      const ShipmentLine = shipmentLines[0];
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: ShipmentLine.id }));

      const tempLine = tempOrderLines?.find((i) => ShipmentLine.good.id === i.good.id);
      if (tempLine && tempOrder) {
        fpDispatch(
          fpMovementActions.updateTempOrderLine({
            docId: tempOrder.id,
            line: { ...tempLine, weight: round(tempLine.weight + ShipmentLine.weight, 3) },
          }),
        );
      }
    }
  }, [dispatch, fpDispatch, id, shipmentLines, tempOrder, tempOrderLines]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Отменить последнее сканирование',
        onPress: hanldeCancelLastScan,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditShipmentHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDeleteShipment,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditShipmentHead, handleDeleteShipment]);

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

  const handleUseSendDoc = useSendDocs([shipment]);

  const handleSendDoc = useCallback(() => {
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setScreenState('sending');
          setTimeout(() => {
            if (screenState !== 'idle') {
              setScreenState('idle');
            }
          }, 10000);
          handleUseSendDoc();
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [handleUseSendDoc, screenState]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <SendButton onPress={handleSendDoc} disabled={screenState !== 'idle'} />
          <MenuButton actionsMenu={actionsMenu} disabled={screenState !== 'idle'} />
        </View>
      ),
    [actionsMenu, handleSendDoc, isBlocked, screenState],
  );

  const renderLeft = useCallback(
    () => <BackButton onPress={() => navigation.navigate('ShipmentList')} />,
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderLeft,
      headerRight: renderRight,
    });
  }, [navigation, renderLeft, renderRight]);

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        Alert.alert('Внимание!', 'Штрих-код не определен! Повторите сканирование!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }
      const barc = getBarcode(brc);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      if (!good) {
        Alert.alert('Внимание!', 'Товар не найден!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const line = shipmentLines.find((i) => i.barcode === barc.barcode);

      if (line) {
        Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const tempLine = tempOrderLines?.find((i) => good.id === i.good.id);

      const newLine: IShipmentLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: shipmentLines.length + 1,
      };

      if (tempLine && tempOrder) {
        const newTempLine = { ...tempLine, weight: round(tempLine.weight - newLine.weight, 3) };
        if (newTempLine.weight > 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
        } else if (newTempLine.weight === 0) {
          fpDispatch(
            fpMovementActions.updateTempOrderLine({
              docId: tempOrder?.id,
              line: newTempLine,
            }),
          );
          dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
        } else {
          Alert.alert('Данное количество превышает количество в заявке', 'Добавить позицию?', [
            {
              text: 'Да',
              onPress: async () => {
                dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
                fpDispatch(
                  fpMovementActions.updateTempOrderLine({
                    docId: tempOrder?.id,
                    line: newTempLine,
                  }),
                );
              },
            },
            {
              text: 'Отмена',
            },
          ]);
        }
      } else {
        Alert.alert('Данный товар отсутствует в позициях заявки', 'Добавить позицию?', [
          {
            text: 'Да',
            onPress: async () => {
              dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }

      setScanned(false);
    },

    [goods, shipmentLines, tempOrderLines, tempOrder, fpDispatch, dispatch, id],
  );

  //Для отрисовки при каждом новом сканировании
  const [key, setKey] = useState(1);

  const setScan = (brc: string) => {
    setKey(key + 1);
    setScanned(true);
    getScannedObject(brc);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref?.current &&
        setTimeout(() => {
          ref.current?.focus();
          ref.current?.clear();
        }, ONE_SECOND_IN_MS);
    }
  }, [scanned, ref]);

  const LineTypes = useCallback(
    () => (
      <View style={styles.containerCenter}>
        {lineTypes.map((e, i) => {
          return (
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor="#DDDDDD"
              key={e.id}
              style={[
                styles.btnTab,
                i === 0 && styles.firstBtnTab,
                i === lineTypes.length - 1 && styles.lastBtnTab,
                e.id === lineType && { backgroundColor: colors.primary },
                { borderColor: colors.primary },
              ]}
              onPress={() => setLineType(e.id)}
            >
              <LargeText style={{ color: e.id === lineType ? colors.background : colors.text }}>{e.value}</LargeText>
            </TouchableHighlight>
          );
        })}
      </View>
    ),
    [colors.background, colors.primary, colors.text, lineType],
  );

  const renderShipmentItem: ListRenderItem<IShipmentLine> = ({ item }) => (
    <ListItemLine key={item.id} readonly={isBlocked}>
      <View style={styles.details}>
        <MediumText style={styles.name}>{item.good.name}</MediumText>
        <View style={styles.directionRow}>
          <MediumText>Вес: {(item.weight || 0).toString()} кг</MediumText>
        </View>
        <MediumText>Номер партии: {item.numReceived || ''}</MediumText>
        <MediumText>Дата: {getDateString(item.workDate) || ''}</MediumText>
      </View>
    </ListItemLine>
  );

  const renderTempItem: ListRenderItem<ITempLine> = ({ item }) => (
    <ListItemLine key={item.id} readonly={isBlocked}>
      <View style={styles.details}>
        <MediumText style={styles.name}>{item.good.name}</MediumText>
        <View style={styles.directionRow}>
          <MediumText>Вес: {(item.weight || 0).toString()} кг</MediumText>
        </View>
      </View>
    </ListItemLine>
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
  } else {
    if (!shipment) {
      return (
        <View style={[styles.container, styles.alignItemsCenter]}>
          <LargeText>Документ не найден</LargeText>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(shipment?.status || 'DRAFT')}
        title={shipment.head.outlet?.name || ''}
        onPress={handleEditShipmentHead}
        disabled={!['DRAFT', 'READY'].includes(shipment.status)}
      >
        <View style={styles.infoBlock}>
          <MediumText>{`№ ${shipment.number} на ${getDateString(shipment.head?.onDate)}`}</MediumText>
          {isBlocked ? (
            <View style={styles.rowCenter}>
              <MaterialCommunityIcons name="lock-outline" size={20} />
            </View>
          ) : null}
        </View>
      </InfoBlock>
      <LineTypes />
      <TextInput
        style={styles.scanInput}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      {lineType === 'shipment' ? (
        <>
          <FlatList
            key={lineType}
            data={shipmentLines}
            keyExtractor={keyExtractor}
            renderItem={renderShipmentItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />
          <ShipmentTotal quantity={shipmentLineSum} weight={shipmentLines.length} />
        </>
      ) : (
        <>
          <FlatList
            key={lineType}
            data={tempOrderLines}
            keyExtractor={keyExtractor}
            renderItem={renderTempItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />
          <ShipmentTotal quantity={tempLineSum} weight={tempOrderLines?.length || 0} />
        </>
      )}
    </View>
  );
};

export default ShipmentViewScreen;
