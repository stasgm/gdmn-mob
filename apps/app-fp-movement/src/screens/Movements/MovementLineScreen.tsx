import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { MovementStackParamList } from '../../navigation/Root/types';
import { MovementLine } from '../../components/MovementLine';
import { IMovementLine } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

export const MovementLineScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<MovementStackParamList | MovementStackParamList, 'MovementLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<MovementStackParamList, 'MovementLine'>>().params;
  const [line, setLine] = useState<IMovementLine>(item);

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
      <MovementLine item={line} onSetLine={setLine} />
    </View>
  );
};
