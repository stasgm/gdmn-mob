import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { OrderStackParamList } from '../../navigation/Root/types';

import { IOtvesLine, ITempDocument, ITempLine } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { OrderLine } from './components/OrderLine';

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const OrderLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList | OrderStackParamList, 'OrderLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, tempId, item } = useRoute<RouteProp<OrderStackParamList, 'OrderLine'>>().params;
  const [line, setLine] = useState<IOtvesLine>(item);

  const tempLines = docSelectors.selectByDocId<ITempDocument>(tempId)?.lines;
  console.log('docId', docId);
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
      <OrderLine item={line} onSetLine={setLine} />
    </View>
  );
};
