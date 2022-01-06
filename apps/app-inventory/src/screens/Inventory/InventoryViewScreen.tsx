import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ISettingsOption } from '@lib/types';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';
import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { IInventoryDocument, IInventoryLine } from '../../store/types';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { InventoryItem } from '../../components/InventoryItem';

export const InventoryViewScreen = (props: any) => {
  const { params } = props.route;
  const docType = params?.docType as string;

  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryView'>>();

  const id = useRoute<RouteProp<InventorysStackParamList, 'InventoryView'>>().params?.id;

  const { data: settings } = useSelector((state) => state.settings);
  const scanUsetSetting = (settings.scannerUse as ISettingsOption<string>) || true;

  const inventory = docSelectors.selectByDocType<IInventoryDocument>(docType)?.find((e) => e.id === id);

  const isBlocked = inventory?.status !== 'DRAFT';

  const handleAddInventoryLine = useCallback(() => {
    console.log('ИД', id);
    navigation.navigate('SelectRemainsItem', {
      docId: id,
    });
  }, [navigation, id]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleScannerGood = useCallback(() => {}, []);

  const handleEditInventoryHead = useCallback(() => {
    navigation.navigate('InventoryEdit', { id });
  }, [navigation, id]);

  const handleScanner = useCallback(() => {
    navigation.navigate(scanUsetSetting.data ? 'ScanBarcodeReader' : 'ScanBarcode', { docId: id });
  }, [navigation, id, scanUsetSetting]);

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
        title: 'Добавить товар',
        onPress: handleAddInventoryLine,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditInventoryHead,
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
  }, [showActionSheet, handleAddInventoryLine, handleDelete, handleEditInventoryHead]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <ScanButton onPress={handleScanner} />
            <MenuButton actionsMenu={actionsMenu} />
          </View>
        ),
    });
  }, [navigation, handleAddInventoryLine, handleScannerGood, actionsMenu, handleScanner, isBlocked]);

  if (!inventory) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IInventoryLine }) => (
    <SwipeLineItem docId={inventory.id} item={item} readonly={isBlocked} copy={false} routeName="InventoryLine">
      <InventoryItem docId={inventory.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(inventory?.status || 'DRAFT')}
        title={inventory.head.department?.name || ''}
        onPress={handleEditInventoryHead}
        disabled={!['DRAFT', 'READY'].includes(inventory.status)}
      >
        <View style={styles.rowCenter}>
          <Text>{`№ ${inventory.number} от ${getDateString(inventory.documentDate)}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={inventory.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};
