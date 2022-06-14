import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Dialog, Button, TextInput } from 'react-native-paper';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { MovementStackParamList } from '../../navigation/Root/types';
import { getStatusColor } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { MovementItem } from '../../components/MovementItem';
import { navBackButton } from '../../components/navigateOptions';

export const MovementViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementView'>>();

  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const id = useRoute<RouteProp<MovementStackParamList, 'MovementView'>>().params?.id;

  // const doc = useSelector((state) => state.documents.list).find((e) => e.id === id) as IMovementDocument | undefined;
  const doc = docSelectors.selectByDocId<IMovementDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

  const [barcode, setBarcode] = useState(false);

  const handleAddDocLine = useCallback(() => {
    navigation.navigate('SelectGoodItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('MovementEdit', { id });
  }, [navigation, id]);

  const handleDoScan = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.removeDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар',
        onPress: handleAddDocLine,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditDocHead,
      },
      {
        title: 'Удалить документ',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddDocLine, handleDelete, handleEditDocHead]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <ScanButton onPress={handleDoScan} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleDoScan, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IMovementLine }) => (
    <SwipeLineItem docId={doc.id} item={item} readonly={isBlocked} copy={false} routeName="DocLine">
      <MovementItem docId={doc.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(doc?.status || 'DRAFT')}
        title={doc.documentType.description || ''}
        onPress={handleEditDocHead}
        disabled={!['DRAFT', 'READY'].includes(doc.status)}
      >
        <>
          <Text style={[styles.rowCenter, textStyle]}>Откуда: {doc.head.fromDepart?.name || ''}</Text>
          <Text style={[styles.rowCenter, textStyle]}>Куда: {doc.head.toDepart?.name || ''}</Text>
          <View style={styles.rowCenter}>
            <Text style={textStyle}>{`№ ${doc.number} от ${getDateString(doc.documentDate)}`}</Text>

            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </>
      </InfoBlock>
      <FlatList
        data={doc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      {barcode ? (
        <Dialog visible={barcode} onDismiss={() => setBarcode(false)}>
          <Dialog.Title>Укажите причину отказа</Dialog.Title>
          <Dialog.Content>
            <TextInput value={refuseReason} onChangeText={setRefuseReason} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBarcode(false)}>Отмена</Button>
            <Button onPress={handleRefuse}>Сохранить</Button>
          </Dialog.Actions>
        </Dialog>
      ) : null}
    </View>
  );
};
