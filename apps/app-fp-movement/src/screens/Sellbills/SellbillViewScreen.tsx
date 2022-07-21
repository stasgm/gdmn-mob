import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  AppActivityIndicator,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocument } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { ISellbillDocument, ISellbillLine, ITempLine } from '../../store/types';

import { SellbillStackParamList } from '../../navigation/Root/types';

import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import { navBackButton } from '../../components/navigateOptions';

import SellbillTotal from '../Movements/components/SellbillTotal';

import { IGood, IOrder } from '../../store/app/types';
import { useSelector as useAppSelector } from '../../store/index';

import { getBarcode } from '../../utils/helpers';

import SellbillItem from './components/SellbillItem';
import TempItem from './components/TempItem';

const lineTypes: IListItem[] = [
  {
    id: 'order',
    value: 'Заявки',
  },
  {
    id: 'sellbill',
    value: 'Отвесы',
  },
];

const keyExtractor = (item: ISellbillLine) => item.id;

const SellbillViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillView'>>();
  const id = useRoute<RouteProp<SellbillStackParamList, 'SellbillView'>>().params?.id;
  const dispatch = useDispatch();
  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const [lineType, setLineType] = useState(lineTypes[1].id);

  const [del, setDel] = useState(false);

  const sellbill = docSelectors.selectByDocId<ISellbillDocument>(id);

  const lines = useAppSelector((state) => state.appInventory.list).find((i) => i.id === sellbill.head.orderId) || [];
  const lines2 = useSelector((state) => state.app.list) as IOrder[];
  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

  console.log('list', lines);
  console.log('list2', lines2);

  const [list, setList] = useState([]);
  const isBlocked = sellbill?.status !== 'DRAFT';

  // const handleAddOrderLine = useCallback(() => {
  //   navigation.navigate('SelectGroupItem', {
  //     docId: id,
  //   });
  // }, [navigation, id]);

  useEffect(() => {
    if (lineType === 'sellbill') {
      setList(sellbill.lines);
    } else if (lineType === 'order') {
      setList(lines);
    }
    console.log('list useEffect', list);
  }, [lineType, lines, list, sellbill.lines]);

  const handleEditSellbillHead = useCallback(() => {
    navigation.navigate('SellbillEdit', { id });
  }, [navigation, id]);

  const handleCopySellbill = useCallback(() => {
    const newDocDate = new Date().toISOString();
    const newId = generateId();

    const newDoc: IDocument = {
      ...sellbill,
      id: newId,
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    docDispatch(documentActions.addDocument(newDoc));

    navigation.navigate('TempView', { id: newId });
  }, [sellbill, docDispatch, navigation]);

  const handleDelete = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
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
  }, [docDispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      // {
      //   title: 'Добавить товар',
      //   onPress: handleAddOrderLine,
      // },
      {
        title: 'Редактировать данные',
        onPress: handleEditSellbillHead,
      },
      {
        title: 'Копировать заявку',
        onPress: handleCopySellbill,
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
  }, [showActionSheet, handleEditSellbillHead, handleCopySellbill, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          {/* <AddButton onPress={handleAddOrderLine} /> */}
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = useCallback(
    ({ item }: { item: ISellbillLine | ITempLine }) =>
      lineType === 'selbill' ? (
        <SellbillItem docId={sellbill?.id} item={item} readonly={isBlocked} />
      ) : (
        <TempItem item={item} readonly={isBlocked} />
      ),
    [isBlocked, lineType, sellbill?.id],
  );

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        Alert.alert('Внимание!', 'Штрих-код не определен! Повоторите сканирование!', [{ text: 'OK' }]);
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

      dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));

      setScanned(false);
    },

    [goods, sellbill.lines, dispatch, id],
  );

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
  // const renderOrderItem = useCallback(
  //   ({ item }: { item: ITempLine }) => <TempItem item={item} readonly={isBlocked} />,
  //   [isBlocked],
  // );

  // const lineSum = sellbill.lines?.reduce((sum, line) => ({ weight: sum.weight + (line.weight || 0) }), { weight: 0 });

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
    if (!sellbill) {
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
        colorLabel={getStatusColor(sellbill?.status || 'DRAFT')}
        title={sellbill.head.outlet?.name || ''}
        onPress={handleEditSellbillHead}
        disabled={!['DRAFT', 'READY'].includes(sellbill.status)}
      >
        <View style={localStyles.infoBlock}>
          <Text style={textStyle}>{`№ ${sellbill.number} на ${getDateString(sellbill.head?.onDate)}`}</Text>
          <View style={styles.rowCenter}>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </View>
      </InfoBlock>
      <View style={[styles.containerCenter]}>
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
              <Text style={[{ color: e.id === lineType ? colors.background : colors.text }, { fontSize: 17 }]}>
                {e.value}
              </Text>
            </TouchableHighlight>
          );
        })}
      </View>
      <TextInput
        style={{ width: 1, height: 1 }}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      <FlatList
        // data={sellbill.lines}
        data={lineType === 'order' ? list.lines : list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />

      {/* <Divider style={{ backgroundColor: colors.primary }} /> */}
      {sellbill.lines.length ? <SellbillTotal lines={sellbill.lines} /> : null}
    </View>
  );
};

export default SellbillViewScreen;

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
