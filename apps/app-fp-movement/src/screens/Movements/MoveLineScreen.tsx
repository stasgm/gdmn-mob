import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { MoveStackParamList } from '../../navigation/Root/types';

import { IMoveLine } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { MoveLine } from './components/MoveLine';

export const MoveLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList | MoveStackParamList, 'MoveLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<MoveStackParamList, 'MoveLine'>>().params;
  const [line, setLine] = useState<IMoveLine>(item);

  const handleSave = useCallback(() => {
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );
    navigation.goBack();
  }, [navigation, line, docId, dispatch, mode]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton onPress={handleSave} />
      </View>
    ),
    [handleSave],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  return (
    <View style={[styles.container]}>
      <MoveLine item={line} onSetLine={setLine} />
    </View>
  );
};
