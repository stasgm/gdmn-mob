import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { generateId, getDateString } from '@lib/mobile-app';

import { IMoveDocument, IMoveLine } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';

import { navBackButton } from '../../components/navigateOptions';
import { getBarcode } from '../../utils/helpers';
import { IGood } from '../../store/app/types';

import BarcodeDialog from '../../components/BarcodeDialog';

import { MoveItem } from './components/MoveItem';

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 1000) / 1000;
};

export const MoveViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveView'>>();

  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const id = useRoute<RouteProp<MoveStackParamList, 'MoveView'>>().params?.id;

  // const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument | undefined;
  const doc = docSelectors.selectByDocId<IMoveDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

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
        navigation.navigate('MoveLine', {
          mode: 0,
          docId: id,
          item: barcodeItem,
        });
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [goods, id, navigation],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismisDialog = () => {
    setVisibleDialog(false);
  };

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('MoveEdit', { id });
  }, [navigation, id]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.removeDocument(id));

    navigation.goBack();
  }, [dispatch, id, navigation]);

  const hanldeCancelLastScan = useCallback(() => {
    const lastId = doc.lines[doc.lines.length - 1].id;

    dispatch(documentActions.removeDocumentLine({ docId: id, lineId: lastId }));
  }, [dispatch, doc.lines, id]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Найти штрих-код',
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

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const linesList = doc.lines?.reduce((sum: IMoveLine[], line) => {
    if (!sum.length) {
      sum.push(line);
    }

    if (sum.find((i) => i.id !== line.id)) {
      const lineSum = sum.find((i) => i.good.id === line.good.id && i.numReceived === line.numReceived);
      if (lineSum) {
        const lineTotal: IMoveLine = { ...lineSum, weight: round(lineSum.weight + line.weight) };
        sum.splice(sum.indexOf(lineSum), 1, lineTotal);
      } else {
        sum.push(line);
      }
    }
    return sum;
  }, []);

  const renderItem = ({ item }: { item: IMoveLine }) => <MoveItem item={item} />;

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setError(false);
  };

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
      >
        <>
          <Text style={[styles.rowCenter, textStyle]}>Откуда: {doc.head.fromDepart?.name || ''}</Text>
          <Text style={[styles.rowCenter, textStyle]}>Куда: {doc.head.toDepart?.name || ''}</Text>
          <View style={styles.rowCenter}>
            <Text style={textStyle}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</Text>

            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </>
      </InfoBlock>
      <FlatList
        data={linesList}
        keyExtractor={(_, i) => String(i)}
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
