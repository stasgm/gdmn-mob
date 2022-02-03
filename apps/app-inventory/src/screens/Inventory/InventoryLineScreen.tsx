import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch, useSelector } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { InventoryStackParamList } from '../../navigation/Root/types';
import { IInventoryLine } from '../../store/types';
import { InventoryLine } from '../../components/InventoryLine';

export const InventoryLineScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<InventoryStackParamList | InventoryStackParamList, 'InventoryLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<InventoryStackParamList, 'InventoryLine'>>().params;
  const [line, setLine] = useState<IInventoryLine>(item);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data) || true;

  const handleSave = useCallback(() => {
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );
    navigation.goBack();
  }, [navigation, line, docId, dispatch, mode]);

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

  return (
    <View style={[styles.container]}>
      <InventoryLine item={line} onSetLine={setLine} />
    </View>
  );
};
