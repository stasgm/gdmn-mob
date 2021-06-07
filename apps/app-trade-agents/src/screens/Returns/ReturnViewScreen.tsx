import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import {
  AddButton,
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
} from '@lib/mobile-ui';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import ReturnItem from './components/ReturnItem';

const ReturnViewScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params?.id;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const ref = useRef<FlatList<IOrderLine>>(null);

  const handleAddReturnLine = useCallback(() => {
    navigation.navigate('SelectItem', {
      docId: id,
      name: 'good',
    });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (id) {
      dispatch(documentActions.deleteDocument(id));
      navigation.navigate('ReturnList');
    }
  }, [dispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddReturnLine,
      },
      {
        title: 'Редактировать',
        // onPress: handleAddOrderLine,
      },
      {
        title: 'Удалить',
        type: 'destructive',
        onPress: handleDelete,
      },
    ]);
  }, [showActionSheet, handleAddReturnLine, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddReturnLine} />
        </View>
      ),
    });
  }, [navigation, handleAddReturnLine, actionsMenu]);

  const returnDoc = ((docSelectors.selectByDocType('return') as unknown) as IOrderDocument[])?.find((e) => e.id === id);

  if (!returnDoc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Заказ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IOrderLine }) => <ReturnItem docId={returnDoc.id} item={item} />;

  return (
    <View style={[styles.container]}>
      {/* <Header item={order} /> */}
      <InfoBlock colorLabel="#3914AF" title={returnDoc?.head.outlet.name}>
        <>
          <Text>{returnDoc.number}</Text>
          <Text>{returnDoc.head.ondate}</Text>
        </>
      </InfoBlock>
      <Divider />
      <FlatList
        ref={ref}
        data={returnDoc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReturnViewScreen;
