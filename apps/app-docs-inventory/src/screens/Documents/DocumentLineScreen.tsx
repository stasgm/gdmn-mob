import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { DocumentsStackParamList, RoutesStackParamList } from '../../navigation/Root/types';
import { IInventoryLine } from '../../store/types';

import { DocumentLine } from './components/DocumentLine';

export const DocumentLineScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<DocumentsStackParamList | RoutesStackParamList, 'DocumentLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<DocumentsStackParamList, 'DocumentLine'>>().params;

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
      <DocumentLine item={line} onSetLine={setLine} />
    </View>
  );
};
