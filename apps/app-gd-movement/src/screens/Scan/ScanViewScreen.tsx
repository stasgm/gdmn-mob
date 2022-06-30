import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Text, View, FlatList, Modal, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
  ScanButton,
} from '@lib/mobile-ui';

import { generateId, getDateString } from '@lib/mobile-app';

import { IScanDocument, IScanLine } from '../../store/types';
import { ScanStackParamList } from '../../navigation/Root/types';
import { getStatusColor, ONE_SECOND_IN_MS } from '../../utils/constants';
import SwipeLineItem from '../../components/SwipeLineItem';
import { navBackButton } from '../../components/navigateOptions';
import { ScanDataMatrix, ScanDataMatrixReader } from '../../components';

import { ScanItem } from './components/ScanItem';

export const ScanViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ScanStackParamList, 'ScanView'>>();

  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const [doScanned, setDoScanned] = useState(false);

  const id = useRoute<RouteProp<ScanStackParamList, 'ScanView'>>().params?.id;

  const doc = docSelectors.selectByDocId<IScanDocument>(id);

  const isBlocked = doc?.status !== 'DRAFT';

  const currRef = useRef<TextInput>(null);
  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), ONE_SECOND_IN_MS);
  }, []);

  const handleEIDScanned = (data: string) => {
    const line: IScanLine = { id: generateId(), barcode: data };
    dispatch(documentActions.addDocumentLine({ docId: id, line }));
  };

  const handleDoScan = useCallback(() => {
    setDoScanned(true);
  }, []);

  const handleEditDocHead = useCallback(() => {
    navigation.navigate('ScanEdit', { id });
  }, [navigation, id]);

  // const handleDoScan = useCallback(() => {
  //   navigation.navigate('ScanBarcode', { docId: id });
  // }, [navigation, id]);

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
  }, [showActionSheet, handleDelete, handleEditDocHead]);

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

  const renderItem = ({ item, index }: { item: IScanLine; index: number }) => (
    <SwipeLineItem docId={doc.id} item={item} readonly={isBlocked} copy={false} routeName="DocLine">
      <ScanItem docId={doc.id} item={item} readonly={isBlocked} index={index} />
    </SwipeLineItem>
  );

  if (!doc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  return (
    <>
      <Modal animationType="slide" visible={doScanned}>
        {isScanerReader ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal>
      <View style={[styles.container]}>
        <InfoBlock
          colorLabel={getStatusColor(doc?.status || 'DRAFT')}
          title={doc?.head?.department?.name || ''}
          onPress={handleEditDocHead}
          disabled={!['DRAFT', 'READY'].includes(doc.status)}
        >
          <>
            {/* <Text style={[styles.rowCenter, textStyle]}>{doc?.head?.department?.name || ''}</Text> */}
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
      </View>
    </>
  );
};
