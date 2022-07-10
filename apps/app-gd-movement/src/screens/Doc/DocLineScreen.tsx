import React, { useCallback, useLayoutEffect, useState, useEffect } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles, AppActivityIndicator } from '@lib/mobile-ui';

import { DocStackParamList } from '../../navigation/Root/types';
import { DocLine } from '../../components/DocLine';
import { IMovementLine } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

export const DocLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList | DocStackParamList, 'DocLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<DocStackParamList, 'DocLine'>>().params;
  const [line, setLine] = useState<IMovementLine>(item);

  const [screenState, setScreenState] = useState<'idle' | 'saving'>('idle');

  // const handleSave = useCallback(() => {
  //   dispatch(
  //     mode === 0
  //       ? documentActions.addDocumentLine({ docId, line })
  //       : documentActions.updateDocumentLine({ docId, line }),
  //   );
  //   navigation.goBack();
  // }, [navigation, line, docId, dispatch, mode]);

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
    <View style={styles.container}>
      <DocLine item={line} onSetLine={setLine} />
    </View>
  );
};
