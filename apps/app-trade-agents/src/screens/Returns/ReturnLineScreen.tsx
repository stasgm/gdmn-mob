import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { ReturnsStackParamList } from '../../navigation/Root/types';

import { IReturnLine } from '../../store/docs/types';

import ReturnLine from './components/ReturnLine';

const ReturnLineScreen = () => {
  const { mode, docId, item } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnLine'>>().params;

  const [line, setLine] = useState<IReturnLine>(item);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const showActionSheet = useActionSheet();

  const handleSave = useCallback(() => {
    if (mode === 0) {
      dispatch(documentActions.addDocumentLine({ docId, line }));
    } else {
      dispatch(documentActions.updateDocumentLine({ docId, line }));
    }

    navigation.navigate('ReturnView', { id: docId });
  }, [navigation, line, docId, dispatch, mode]);

  /* const handleDelete = useCallback(() => {
    dispatch(documentActions.deleteDocumentLine({ docId, lineId: line.id }));
    navigation.navigate('ReturnView', { id: docId });
  }, [dispatch, docId, line.id, navigation]); */

  /*   const actionsMenu = useCallback(() => {
      showActionSheet([
        {
          title: 'Удалить',
          type: 'destructive',
          onPress: handleDelete,
        },
      ]);
    }, [handleDelete, showActionSheet]); */

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
      <ReturnLine item={item} onSetLine={(value: IReturnLine) => setLine(value)} />
    </View>
  );
};
export default ReturnLineScreen;
