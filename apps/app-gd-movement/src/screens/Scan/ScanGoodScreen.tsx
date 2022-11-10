import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, LargeText, MediumText, navBackButton, ScanBarcode } from '@lib/mobile-ui';
import { docSelectors, useDispatch, documentActions } from '@lib/store';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { ScanStackParamList } from '../../navigation/Root/types';
import { IScanLine, IScanDocument } from '../../store/types';

const ScanGoodScreen = () => {
  const docId = useRoute<RouteProp<ScanStackParamList, 'ScanGood'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<ScanStackParamList, 'ScanGood'>>();

  const dispatch = useDispatch();

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const [scannedObject, setScannedObject] = useState<IScanLine>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const doc = docSelectors.selectByDocId<IScanDocument>(docId);

  const handleGetScannedObject = useCallback((brc: string) => {
    setScannedObject({ id: generateId(), barcode: brc });

    setScaner({ state: 'found' });
  }, []);

  const handleSaveScannedItem = useCallback(() => {
    if (!scannedObject) {
      return;
    }

    if (!doc) {
      return;
    }

    const line: IScanLine = { ...scannedObject, sortOrder: doc?.lines?.length + 1 };

    dispatch(documentActions.addDocumentLine({ docId, line }));

    setScaner({ state: 'init' });
  }, [scannedObject, doc, dispatch, docId]);

  const handleClearScaner = () => setScaner({ state: 'init' });

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!doc) {
    return (
      <View style={[globalStyles.container, globalStyles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <ScanBarcode
      onSave={handleSaveScannedItem}
      onGetScannedObject={handleGetScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      barCodeTypes={[]}
    >
      {scannedObject ? (
        <View style={localStyles.itemInfo}>
          <MediumText style={localStyles.text}>{scannedObject.barcode}</MediumText>
        </View>
      ) : undefined}
    </ScanBarcode>
  );
};

export default ScanGoodScreen;

const localStyles = StyleSheet.create({
  itemInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  text: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});
