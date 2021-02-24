import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Colors, FAB, IconButton, Avatar } from 'react-native-paper';

import { ILine, IReference, IGood, IContact, IRefData } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { statusColors } from '../../../constants';
import { formatValue } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ContentItem = React.memo(({ item, isEditable }: { item: ILine; isEditable: boolean }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const docId = useRoute<RouteProp<RootStackParamList, 'DocumentView'>>().params?.docId;

  const good: IGood = ((state.references?.goods as unknown) as IReference<IGood>)?.data.find(
    (i) => i.id === item.goodId,
  );

  return (
    <>
      <View style={{ backgroundColor: colors.card }}>
        <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} />
      </View>
      <View style={localStyles.details}>
        <View>
          <Text style={localStyles.name}> {good?.name || 'товар не найден'} </Text>
        </View>
        <View>
          <Text style={localStyles.itemInfo}>
            {item.quantity} × {formatValue({ type: 'currency', decimals: 2 }, item.price ?? 0)}
          </Text>
        </View>
      </View>
      {isEditable && (
        <View style={localStyles.remainsInfo}>
          <TouchableOpacity
            style={localStyles.buttonDelete}
            onPress={() => {
              Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
                {
                  text: 'OK',
                  onPress: () => {
                    actions.deleteLine({ docId, lineId: item.id });
                  },
                },
                {
                  text: 'Отмена',
                },
              ]);
            }}
          >
            <MaterialIcons size={25} color={colors.primary} name="delete-forever" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
});

type Props = StackScreenProps<RootStackParamList, 'DocumentView'>;

const DocumentViewScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state } = useAppStore();

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const documentLines = document?.lines;

  const isEditable = document?.head?.status === 0;

  const docTitle = `№${document?.head?.docnumber} от ${new Date(document?.head?.date)?.toLocaleDateString('BY-ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`;

  const documentTypeName = useMemo(
    () =>
      (state.references?.documenttypes?.data as IRefData[])?.find(
        (i) => i.id.toString() === document?.head?.doctype.toString(),
      )?.name || '',
    [state.references?.documenttypes?.data, document?.head?.doctype],
  );

  const contacts = (state.references?.contacts?.data as unknown) as IContact[];

  const contact = useMemo(() => contacts?.find((item: { id: number }) => item.id === document?.head?.fromcontactId), [
    contacts,
    document?.head?.fromcontactId,
  ]);

  const totalQuantity = useMemo(() => {
    return (documentLines ?? []).reduce(
      (total, line) => Number.parseFloat(((Number(line.quantity) ?? 0) + total).toFixed(3)),
      0,
    );
  }, [documentLines]);

  const refList = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(refList);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: documentTypeName,
      headerLeft: () => (
        <IconButton
          icon="arrow-left-circle-outline"
          size={25}
          onPress={() => {
            navigation.navigate('DocumentList');
          }}
        />
      ),
      headerRight: () => (
        <IconButton
          icon="file-document-edit-outline"
          size={24}
          onPress={() => {
            navigation.navigate('DocumentEdit', { docId });
          }}
        />
      ),
    });
  }, [docId, navigation, documentTypeName]);

  const LineItem = useCallback(
    ({ item }: { item: ILine }) => {
      return (
        <TouchableOpacity
          style={localStyles.item}
          disabled={!isEditable}
          onPress={() => {
            navigation.navigate('DocumentLineEdit', {
              lineId: item.id,
              prodId: item.goodId,
              docId,
              modeCor: true,
              price: item.price,
              remains: item.remains,
            });
          }}
        >
          <ContentItem item={item} isEditable={isEditable} />
        </TouchableOpacity>
      );
    },
    [isEditable, navigation, docId],
  );

  return document ? (
    <>
      <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
        <View style={[localStyles.documentHeader, { backgroundColor: statusColors[document?.head?.status] }]}>
          <Text style={[localStyles.documentHeaderText, { color: colors.card }]}>{docTitle}</Text>
          <Text style={[localStyles.documentText, { color: colors.card }]}>{contact?.name}</Text>
        </View>
        <FlatList
          ref={refList}
          data={document.lines ?? []}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }: { item: ILine }) => <LineItem item={item} />}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Общее количество:</Text>
          <Text style={localStyles.fontWeightBold}>{totalQuantity}</Text>
        </View>
      </View>
      {isEditable && (
        <>
          <FAB
            style={[localStyles.fabScan, { backgroundColor: colors.primary }]}
            icon="barcode-scan"
            onPress={() =>
              navigation.navigate(state.settings?.barcodeReader ? 'ScanBarcodeReader' : 'ScanBarcode', {
                docId: document?.id,
              })
            }
          />
          <FAB
            style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
            icon="feature-search-outline"
            onPress={() => navigation.navigate('RemainsList', { docId: document?.id })}
          />
        </>
      )}
    </>
  ) : null;
};

export { DocumentViewScreen };

const localStyles = StyleSheet.create({
  buttonDelete: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    right: 0,
  },
  container: {
    padding: 0,
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  documentHeader: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  documentHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  documentText: {
    textAlign: 'center',
  },
  fabAdd: {
    backgroundColor: Colors.blue600,
    bottom: 35,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  fabScan: {
    backgroundColor: Colors.blue600,
    bottom: 35,
    left: 0,
    margin: 20,
    position: 'absolute',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
    marginVertical: 4,
    paddingLeft: 4,
  },
  itemInfo: {
    opacity: 0.5,
  },
  lineTotal: {
    backgroundColor: '#eee',
    justifyContent: 'space-between',
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  remainsInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
});
