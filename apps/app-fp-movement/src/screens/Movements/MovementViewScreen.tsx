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

import { IMovementDocument, IMovementLine } from '../../store/types';
import { MovementStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { MovementItem } from '../../components/MovementItem';
import { navBackButton } from '../../components/navigateOptions';
import { getBarcode } from '../../utils/helpers';
import { IGood } from '../../store/app/types';

import BarcodeDialog from './components/BarcodeDialog';

export const MovementViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementView'>>();

  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const id = useRoute<RouteProp<MovementStackParamList, 'MovementView'>>().params?.id;

  // const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument | undefined;
  const doc = docSelectors.selectByDocId<IMovementDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(false);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const handleGetBarcode = useCallback(
    (brc: string) => {
      const barc = getBarcode(brc);
      console.log('brc', brc);

      console.log('123');

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
        navigation.navigate('MovementLine', {
          mode: 0,
          docId: id,
          item: barcodeItem,
        });
      } else {
        setError(true);
        // return;
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
    navigation.navigate('MovementEdit', { id });
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

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Найти штрих-код',
        onPress: handleShowDialog,
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
  }, [showActionSheet, handleDelete, handleEditDocHead]);

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

  const renderItem = ({ item }: { item: IMovementLine }) => (
    <SwipeLineItem docId={doc.id} item={item} readonly={isBlocked} copy={false} routeName="DocLine">
      <MovementItem docId={doc.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
    // setBarcode('');
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
        data={doc.lines}
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
