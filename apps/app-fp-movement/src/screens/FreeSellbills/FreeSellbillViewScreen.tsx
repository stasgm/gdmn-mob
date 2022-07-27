import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Alert, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors, useDispatch, useDocThunkDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  SendButton,
  AppActivityIndicator,
  MediumText,
  AppDialog,
} from '@lib/mobile-ui';

import { generateId, getDateString, keyExtractor, useSendDocs } from '@lib/mobile-app';

import { sleep } from '@lib/client-api';

import colors from '@lib/mobile-ui/src/styles/colors';

import { IFreeSellbillDocument, IFreeSellbillLine } from '../../store/types';
import { FreeSellbillStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';

import { navBackButton } from '../../components/navigateOptions';
import { getBarcode } from '../../utils/helpers';
import { IGood } from '../../store/app/types';

import { FreeSellbillItem } from './components/FreeSellbillItem';
import FreeSellbillTotal from './components/FreeSellbillTotal';

export interface IScanerObject {
  item?: IFreeSellbillLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}

export const FreeSellbillViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<FreeSellbillStackParamList, 'FreeSellbillView'>>();

  const [screenState, setScreenState] = useState<'idle' | 'sending' | 'deleting'>('idle');

  const id = useRoute<RouteProp<FreeSellbillStackParamList, 'FreeSellbillView'>>().params?.id;

  const doc = docSelectors.selectByDocId<IFreeSellbillDocument>(id);

  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);

  const isBlocked = useMemo(() => doc?.status !== 'DRAFT', [doc?.status]);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage('');
        navigation.navigate('FreeSellbillLine', {
          mode: 0,
          docId: id,
          item: barcodeItem,
        });
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setErrorMessage('Товар не найден');
      }
    },

    [goods, id, navigation],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setErrorMessage('');
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('FreeSellbillEdit', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить документ?', '', [
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

  const hanldeCancelLastScan = useCallback(() => {
    if (lines.length) {
      dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lines[lines.length - 1].id }));
    }
  }, [dispatch, id, lines]);

  const handleUseSendDoc = useSendDocs([doc]);

  const handleSendDoc = useCallback(() => {
    setScreenState('sending');
    Alert.alert('Вы уверены, что хотите отправить документ?', '', [
      {
        text: 'Да',
        onPress: async () => {
          setTimeout(() => {
            setScreenState('idle');
          }, 10000);
          handleUseSendDoc();
        },
      },
      {
        text: 'Отмена',
        onPress: () => {
          setScreenState('idle');
        },
      },
    ]);
  }, [handleUseSendDoc]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Ввести штрих-код',
        onPress: handleShowDialog,
      },
      {
        title: 'Отменить последнее сканирование',
        onPress: hanldeCancelLastScan,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditDocHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, hanldeCancelLastScan, handleEditDocHead, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons} pointerEvents={screenState !== 'idle' ? 'none' : 'auto'}>
          <SendButton onPress={handleSendDoc} disabled={screenState !== 'idle'} />
          {/* <ScanButton onPress={handleDoScan} /> */}
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleSendDoc, isBlocked, screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = useCallback(
    ({ item }: { item: IFreeSellbillLine }) => <FreeSellbillItem key={item.id} item={item} />,
    [],
  );

  const [scanned, setScanned] = useState(false);

  const ref = useRef<TextInput>(null);

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

      const line = doc?.lines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        Alert.alert('Внимание!', 'Данный штрих-код уже добавлен!', [{ text: 'OK' }]);
        setScanned(false);
        return;
      }

      const newLine: IFreeSellbillLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        sortOrder: doc?.lines?.length + 1,
      };

      dispatch(documentActions.addDocumentLine({ docId: id, line: newLine }));

      setScanned(false);
    },

    [dispatch, id, doc?.lines, goods],
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

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (screenState === 'deleting') {
    return (
      <View style={styles.container}>
        <View style={localStyles.deleting}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.head.depart.name || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
        isBlocked={isBlocked}
      >
        <View style={styles.directionColumn}>
          <MediumText>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</MediumText>
        </View>
      </InfoBlock>

      <TextInput
        style={styles.scanInput}
        key={key}
        autoFocus={true}
        selectionColor="transparent"
        ref={ref}
        showSoftInputOnFocus={false}
        onChangeText={(text) => !scanned && setScan(text)}
      />
      <FlatList
        data={lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
      {lines.length ? <FreeSellbillTotal lines={lines} /> : null}
      <AppDialog
        visible={visibleDialog}
        text={barcode}
        onChangeText={setBarcode}
        onCancel={handleDismissBarcode}
        onOk={handleSearchBarcode}
        okLabel={'Найти'}
        errorMessage={errorMessage}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  deleting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
