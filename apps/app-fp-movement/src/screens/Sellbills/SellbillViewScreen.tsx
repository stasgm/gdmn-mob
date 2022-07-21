import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDocThunkDispatch } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  AppActivityIndicator,
  MediumText,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocument } from '@lib/types';

import { Divider } from 'react-native-paper';

import { ISellbillDocument, ISellbillLine } from '../../store/types';

import { SellbillStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import { navBackButton } from '../../components/navigateOptions';

import SellbillItem from './components/SellbillItem';

const keyExtractor = (item: ISellbillLine) => item.id;

const SellbillViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillView'>>();
  const id = useRoute<RouteProp<SellbillStackParamList, 'SellbillView'>>().params?.id;

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const [del, setDel] = useState(false);

  const sellbill = docSelectors.selectByDocId<ISellbillDocument>(id);

  const isBlocked = sellbill?.status !== 'DRAFT';

  // const handleAddOrderLine = useCallback(() => {
  //   navigation.navigate('SelectGroupItem', {
  //     docId: id,
  //   });
  // }, [navigation, id]);

  const handleEditSellbillHead = useCallback(() => {
    navigation.navigate('SellbillEdit', { id });
  }, [navigation, id]);

  const handleCopySellbill = useCallback(() => {
    const newDocDate = new Date().toISOString();
    const newId = generateId();

    const newDoc: IDocument = {
      ...sellbill,
      id: newId,
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    docDispatch(documentActions.addDocument(newDoc));

    navigation.navigate('TempView', { id: newId });
  }, [sellbill, docDispatch, navigation]);

  const handleDelete = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setDel(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      // {
      //   title: 'Добавить товар',
      //   onPress: handleAddOrderLine,
      // },
      {
        title: 'Редактировать данные',
        onPress: handleEditSellbillHead,
      },
      {
        title: 'Копировать заявку',
        onPress: handleCopySellbill,
      },
      {
        title: 'Удалить заявку',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleEditSellbillHead, handleCopySellbill, handleDelete]);

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          {/* <AddButton onPress={handleAddOrderLine} /> */}
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = useCallback(
    ({ item }: { item: ISellbillLine }) => <SellbillItem docId={sellbill?.id} item={item} readonly={isBlocked} />,
    [isBlocked, sellbill?.id],
  );

  const lineSum = sellbill.lines?.reduce((sum, line) => ({ weight: sum.weight + (line.weight || 0) }), { weight: 0 });

  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (del) {
    return (
      <View style={styles.container}>
        <View style={localStyles.del}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colorStyle} />
        </View>
      </View>
    );
  } else {
    if (!sellbill) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(sellbill?.status || 'DRAFT')}
        title={sellbill.head.outlet?.name || ''}
        onPress={handleEditSellbillHead}
        disabled={!['DRAFT', 'READY'].includes(sellbill.status)}
      >
        <View style={localStyles.infoBlock}>
          <Text style={textStyle}>{`№ ${sellbill.number} на ${getDateString(sellbill.head?.onDate)}`}</Text>
          <View style={styles.rowCenter}>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </View>
      </InfoBlock>
      <FlatList
        data={sellbill.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[localStyles.margins]}>
        <View style={localStyles.content}>
          <MediumText style={styles.textTotal}>Общий вес (кг): {lineSum.weight}</MediumText>
          <MediumText style={styles.textTotal}>Общее количество: {sellbill.lines.length}</MediumText>
        </View>
      </View>
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={localStyles.groupWidth}>
              <MediumText>Общий вес: </MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText style={styles.textTotal}>{lineSum.weight}</MediumText>
              <MediumText style={styles.textTotal}>{sellbill.lines.length}</MediumText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SellbillViewScreen;

const localStyles = StyleSheet.create({
  del: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    flexDirection: 'column',
  },
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  content: {
    alignItems: 'flex-end',
  },
  groupWidth: {
    width: '62%',
  },
  // groupMargin: {
  //   marginHorizontal: 5,
  // },
  quantity: {
    alignItems: 'flex-end',
    width: '35%',
  },
  // total: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 5,
  // },
});
