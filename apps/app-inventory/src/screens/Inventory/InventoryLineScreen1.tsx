import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, FlatList, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch, useSelector } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles, ItemSeparator, PrimeButton } from '@lib/mobile-ui';
import { ISettingsOption } from '@lib/types';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { IInventoryLine } from '../../store/types';

import { inv } from '../../utils/constants';

import { LineItem } from './components/InvLine';
import { ScanDataMatrixReader } from '../../components/Scanners/ScanDataMatrixReader';
import { ScanDataMatrix } from '../../components/Scanners/ScanDataMatrix';

interface IProperty {
  sortOrder?: number;
  name: string;
  title?: string;
  visible?: boolean;
  value?: string;
}

export const InventoryLineScreen1 = () => {
  const navigation =
    useNavigation<StackNavigationProp<InventorysStackParamList | InventorysStackParamList, 'InventoryLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<InventorysStackParamList, 'InventoryLine'>>().params;
  const [line, setLine] = useState<IInventoryLine>(item);

  const [doScanned, setDoScanned] = useState(false);

  const { data: settings } = useSelector((state) => state.settings);
  const scanUsetSetting = settings.scannerUse as ISettingsOption<string>;

  const handleSave = useCallback(() => {
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );

    navigation.goBack();
  }, [navigation, line, docId, dispatch, mode]);

  const metadata = inv.find((ii) => ii).lines.metadata;
  console.log('b111', metadata);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <SaveButton onPress={handleSave} />
        </View>
      ),
    });
  }, [navigation, handleSave]);

  Object.entries(line)?.map(([key, value]) => {
    console.log('key', key, 'value', value);
  });

  const refData = useMemo(
    () =>
      item &&
      Object.entries(metadata)
        ?.map(
          ([key, value]) =>
            ({
              sortOrder: value?.sortOrder,
              name: key,
              title: value?.name,
              visible: value?.visible !== false,
              value:
                key === 'EID' ? (line[key] ? line[key] : '') : key === 'good' ? line[key].name : line[key],
            } as IProperty),
        )
        .filter((i) => i.visible && i.name !== 'goodName')
        .sort((a, b) => ((a.sortOrder || 0) < (b?.sortOrder || 0) ? -1 : 1)),
    [item, metadata, line],
  );

  const renderItem = ({ item }: { item: IProperty }) => {
    console.log('item', item);
    return <LineItem item={item} />;
  };

  return (
    <View>
      {/* <Modal animationType="slide" visible={doScanned}>
        {scanUsetSetting.data ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal> */}
      <View style={[styles.content]}>
        <FlatList
          data={refData}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
        <PrimeButton icon="barcode-scan">Сканировать EID</PrimeButton>
      </View>
    </View>
  );
};
