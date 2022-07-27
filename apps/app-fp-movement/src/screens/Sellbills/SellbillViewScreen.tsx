import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, View, FlatList, ActivityIndicator, StyleSheet, TouchableHighlight, TextInput } from 'react-native';
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
  SubTitle,
  AppActivityIndicator,
  MediumText,
  LargeText,
  BackButton,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { generateId, getDateString, round } from '@lib/mobile-app';

import { ISellbillDocument, ISellbillLine, ITempLine } from '../../store/types';

import { SellbillStackParamList } from '../../navigation/Root/types';

import { getStatusColor, lineTypes, ONE_SECOND_IN_MS } from '../../utils/constants';

import { IGood } from '../../store/app/types';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../../store/index';

import { getBarcode } from '../../utils/helpers';

import SellbillTotal from './components/SellbillTotal';

import SellbillItem from './components/SellbillItem';
import TempItem from './components/TempItem';

const keyExtractor = (item: ISellbillLine | ITempLine) => item.id;

const SellbillViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillView'>>();
  const id = useRoute<RouteProp<SellbillStackParamList, 'SellbillView'>>().params?.id;
  const dispatch = useDispatch();
  const fpDispatch = useFpDispatch();

  const [lineType, setLineType] = useState(lineTypes[1].id);

  const [deleting, setDeleting] = useState(false);

  const sellbill = docSelectors.selectByDocId<ISellbillDocument>(id);
  const sellBillLines = useMemo(
    () => sellbill?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)),
    [sellbill?.lines],
  );

  const tempOrder = useFpSelector((state) => state.fpMovement.list).find((i) => i.orderId === sellbill?.head?.orderId);
  const tempOrderLines = tempOrder?.lines as ITempLine[];

  const isBlocked = sellbill?.status !== 'DRAFT';

  const sellbillLineSum = sellbill?.lines?.reduce((sum, line) => sum + line.weight, 0) || 0;
  const tempLineSum = tempOrder?.lines?.reduce((sum, line) => sum + line.weight, 0) || 0;

  const handleEditSellbillHead = useCallback(() => navigation.navigate('SellbillEdit', { id }), [navigation, id]);

  const handleDeleteSellbill = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            fpDispatch(fpMovementActions.removeTempOrder(sellbill?.head.orderId));
            setDeleting(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, fpDispatch, id, navigation, sellbill?.head.orderId]);

  const hanldeCancelLastScan = useCallback(() => {
    if (sellbill?.lines.length) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: sellbill.lines[sellbill.lines.length - 1].id }));
    }
  }, [dispatch, id, sellbill?.lines]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Отменить последнее сканирование',
        onPress: hanldeCancelLastScan,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditSellbillHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDeleteSellbill,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditSellbillHead, handleDeleteSellbill]);

  const renderRight = useCallback(
    () => !isBlocked && <MenuButton actionsMenu={actionsMenu} />,
    [actionsMenu, isBlocked],
  );

  const renderLeft = useCallback(
    () => <BackButton onPress={() => navigation.navigate('SellbillList')} />,
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

      const line = sellbill.lines.find((i) => i.barcode === barc.barcode);

      if (line) {
        Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const tempLine = tempOrderLines?.find((i) => good.id === i.good.id);

      const newLine: ISellbillLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: sellbill.lines.length + 1,
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
        } else if (newTempLine.weight === 0) {
          fpDispatch(fpMovementActions.removeTempOrderLine({ docId: tempOrder?.id, lineId: tempLine.id }));
        } else {
          Alert.alert('Данное количество превышает количество в заявке', 'Добавить позицию?', [
            {
              text: 'Да',
              onPress: async () => {
                fpDispatch(fpMovementActions.removeTempOrderLine({ docId: tempOrder?.id, lineId: tempLine.id }));
              },
            },
            {
              text: 'Отмена',
            },
          ]);
        }
        dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));
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

    [goods, sellbill?.lines, tempOrderLines, tempOrder, dispatch, id, fpDispatch],
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

  const renderSellbillItem = useCallback(
    ({ item }: { item: ISellbillLine }) => <SellbillItem docId={sellbill?.id} item={item} readonly={isBlocked} />,
    [isBlocked, sellbill?.id],
  );

  const renderTempItem = useCallback(
    ({ item }: { item: ISellbillLine | ITempLine }) => <TempItem item={item} readonly={isBlocked} />,
    [isBlocked],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (deleting) {
    return (
      <View style={styles.container}>
        <View style={localStyles.deleting}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  } else {
    if (!sellbill) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(sellbill?.status || 'DRAFT')}
        title={sellbill.head.outlet?.name || ''}
        onPress={handleEditSellbillHead}
        disabled={!['DRAFT', 'READY'].includes(sellbill.status)}
      >
        <View style={localStyles.infoBlock}>
          <MediumText>{`№ ${sellbill.number} на ${getDateString(sellbill.head?.onDate)}`}</MediumText>
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
            data={sellBillLines}
            keyExtractor={keyExtractor}
            renderItem={renderSellbillItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />
          <SellbillTotal quantity={sellbillLineSum} weight={sellbill?.lines?.length} />
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
          <SellbillTotal quantity={tempLineSum} weight={tempOrder?.lines?.length || 0} />
        </>
      )}
    </View>
  );
};

export default SellbillViewScreen;

const localStyles = StyleSheet.create({
  deleting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    flexDirection: 'column',
  },
});
