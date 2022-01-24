import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { IInventoryLine } from '../../store/types';
import { InventoryLine } from '../../components/InventoryLine';

export const InventoryLineScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<InventorysStackParamList | InventorysStackParamList, 'InventoryLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<InventorysStackParamList, 'InventoryLine'>>().params;
  const [line, setLine] = useState<IInventoryLine>(item);

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
