import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { ReturnsStackParamList, RoutesStackParamList } from '../../navigation/Root/types';

import { IReturnLine } from '../../store/types';

import ReturnLine from './components/ReturnLine';

const ReturnLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList | RoutesStackParamList, 'ReturnLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnLine'>>().params;

  const [line, setLine] = useState<IReturnLine>(item);

  const handleSave = useCallback(() => {
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );

    navigation.goBack();
    // navigation.navigate('ReturnView', { id: docId });
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
      <ReturnLine item={item} onSetLine={setLine} />
    </View>
  );
};
export default ReturnLineScreen;
