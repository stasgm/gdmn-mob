import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles, AppActivityIndicator } from '@lib/mobile-ui';

import { MoveStackParamList } from '../../../navigation/Root/types';

import { IMoveLine } from '../../types';
import { navBackButton } from '../../../components/navigateOptions';

import { MoveLine } from './components/MoveLine';

export const MoveLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList | MoveStackParamList, 'MoveLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<MoveStackParamList, 'MoveLine'>>().params;
  const [line, setLine] = useState<IMoveLine>(item);

  const [screenState, setScreenState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      dispatch(
        mode === 0
          ? documentActions.addDocumentLine({ docId, line })
          : documentActions.updateDocumentLine({ docId, line }),
      );
      navigation.goBack();
    }
  }, [dispatch, docId, line, mode, navigation, screenState]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />
      </View>
    ),
    [screenState],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <View style={[styles.container]}>
      <MoveLine item={line} onSetLine={setLine} />
    </View>
  );
};
