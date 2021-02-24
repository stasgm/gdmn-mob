import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Searchbar, FAB, IconButton } from 'react-native-paper';

import { IDocumentStatus, IResponse, IMessageInfo, IDocument, IContact } from '../../../../../common';
import BottomSheet from '../../../components/BottomSheet';
import ItemSeparator from '../../../components/ItemSeparator';
import { RadioGroup } from '../../../components/RadioGroup';
import { statusColors } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { timeout } from '../../../helpers/utils';
import statuses from '../../../model/docStates';
import { IListItem } from '../../../model/types';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const Statuses: IDocumentStatus[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state, actions: appActions } = useAppStore();

  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  const docHead = useMemo(() => item?.head, [item?.head]);
  const fromContact = useMemo(() => getContact(docHead?.fromcontactId), [docHead.fromcontactId, getContact]);

  const docDate = useMemo(() => new Date(item?.head?.date).toLocaleDateString('BY-ru'), [item?.head?.date]);

  const status = useMemo(() => Statuses.find((type) => type.id === item?.head?.status), [item?.head?.status]);

  const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

  let ref = useRef(null);

  const updateRef = (_ref) => {
    ref = _ref;
  };

  const renderRightActions = (progress: unknown) => (
    <View style={localStyles.swipeViewItem}>
      {renderRightAction('edit', 'file-document-edit', '#ffab00', 120, progress)}
      {renderRightAction('delete', 'delete-forever', '#dd2c00', 60, progress)}
    </View>
  );

  const renderRightAction = (name, icon, color, x, progress) => {
    const trans: Animated.AnimatedInterpolation = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [x, 0, 1],
    });

    const pressHandler = () => {
      if (name === 'edit') {
        navigation.navigate('DocumentEdit', { docId: item?.id });
      } else if (name === 'delete') {
        Alert.alert('Вы уверены, что хотите удалить документ?', '', [
          {
            text: 'OK',
            onPress: async () => {
              appActions.deleteDocument(item?.id);
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
      ((ref as unknown) as Swipeable).close();
    };

    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[localStyles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
          <AnimatedIcon name={icon} size={30} color="#fff" style={localStyles.actionIcon} />
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Swipeable friction={2} renderRightActions={renderRightActions} ref={updateRef}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DocumentView', { docId: item?.id });
        }}
      >
        <View style={[localStyles.item, { backgroundColor: colors.card }]}>
          <View style={[localStyles.avatar, { backgroundColor: statusColors[item?.head?.status || 0] }]}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          <View style={localStyles.details}>
            <View style={localStyles.directionRow}>
              <Text style={[localStyles.name, { color: colors.text }]}>{`№ ${docHead?.docnumber} от ${docDate}`}</Text>
              <Text style={[localStyles.number, localStyles.field, { color: statusColors[item?.head?.status] }]}>
                {status ? status.name : ''}
              </Text>
            </View>
            <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
              {fromContact?.name || ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
});

const DocumentListScreen = ({ route, navigation }) => {
  const { colors } = useTheme();

  const ref = useRef<FlatList<IDocument>>(null);

  const showActionSheet = useActionSheet();
  useScrollToTop(ref);

  const {
    apiService,
    state: { isLoading },
  } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions: appActions } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(appState.documents as IDocument[]);

  const option = useMemo(() => {
    return (appState.viewParams?.InvDoc?.selectedOption ?? sort_options[0]) as IListItem;
  }, [appState.viewParams?.InvDoc?.selectedOption]);

  const [selectedOption, setSelectedOption] = useState<IListItem>(option);

  const [sortData, setSortData] = useState(!!option);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentFilter = useCallback(() => {
    setSelectedOption(option);
    bottomSheetRef.current?.present();
  }, [option]);

  const handleApplyFilter = useCallback(() => {
    setSortData(true);
    appActions.setViewParam({
      InvDoc: { ...appState.viewParams?.InvDoc, selectedOption },
    });
    bottomSheetRef.current?.dismiss();
  }, [appState.viewParams?.InvDoc, appActions, selectedOption]);

  const handleDismissFilter = useCallback(() => {
    setSortData(false);
    bottomSheetRef.current?.dismiss();
  }, []);

  const contacts = useMemo(() => appState.references?.contacts?.data as IContact[], [
    appState.references?.contacts?.data,
  ]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  useEffect(() => {
    if (sortData) {
      setData(
        data?.sort((a, b) =>
          option.id === 0
            ? a.head.date > b.head.date
              ? -1
              : 1
            : option.id === 1
            ? a.head.date < b.head.date
              ? -1
              : 1
            : option.id === 2
            ? a.head.docnumber > b.head.docnumber
              ? -1
              : 1
            : option.id === 3
            ? a.head.docnumber < b.head.docnumber
              ? -1
              : 1
            : 1,
        ),
      );
      setSortData(false);
    }
  }, [data, sortData, option]);

  useEffect(() => {
    setData(
      appState.documents?.filter((item) => {
        const docHead = item?.head;

        return docHead?.docnumber?.includes(searchText);
      }) || [],
    );
  }, [appState.documents, searchText, getContact, appState.forms?.filterParams?.fieldSearch]);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = useCallback(async () => {
    const documents = appState.documents?.filter((document) => document?.head?.status === 1);

    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'data',
        payload: {
          name: 'SellDocument',
          params: documents,
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Документы отправлены!', '', [
            {
              text: 'Закрыть',
              onPress: () => {
                documents?.forEach((item) => {
                  appActions.updateDocumentStatus({ id: item?.id, status: item?.head?.status + 1 });
                });
              },
            },
          ]);
        } else {
          Alert.alert('Документы не были отправлены', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [appActions, apiService.baseUrl.timeout, apiService.data, appState.documents, state.companyID]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => <IconButton icon="file-send" size={26} onPress={sendUpdateRequest} />,
      headerRight: () => (
        <IconButton
          icon="menu"
          size={28}
          onPress={() =>
            showActionSheet([
              /*  {
                title: 'Загрузить',
                onPress: () => navigation.navigate('DocumentRequest'),
              }, */
              {
                title: 'Создать документ',
                onPress: () => {
                  navigation.navigate('DocumentEdit');
                },
              },
              {
                title: 'Выгрузить документы',
                onPress: sendUpdateRequest,
              },
              {
                title: 'Удалить документы',
                type: 'destructive',
                onPress: appActions.deleteAllDocuments,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ])
          }
        />
      ),
    });
  }, [appActions.deleteAllDocuments, navigation, sendUpdateRequest, showActionSheet]);

  return (
    <View style={[localStyles.container, { backgroundColor: colors.card }]}>
      {!isLoading && (
        <>
          <>
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск по номеру"
                onChangeText={setSearchText}
                value={searchText}
                style={[localStyles.flexGrow, localStyles.searchBar]}
              />
              <IconButton
                icon="filter-outline"
                size={24}
                style={localStyles.iconSettings}
                onPress={handlePresentFilter}
              />
            </View>
            <ItemSeparator />
          </>
          <FlatList
            ref={ref}
            data={data}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            scrollEventThrottle={400}
            onEndReached={() => ({})}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
          <FAB
            style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
            icon="file-plus"
            onPress={() => {
              navigation.navigate('DocumentEdit');
            }}
          />
        </>
      )}
      <BottomSheet
        sheetRef={bottomSheetRef}
        title={'Настройка фильтра'}
        handelDismiss={handleDismissFilter}
        handelApply={handleApplyFilter}
      >
        <RadioGroup options={sort_options} onChange={setSelectedOption} activeButtonId={selectedOption?.id ?? 0} />
      </BottomSheet>
    </View>
  );
};

const sort_options = [
  { id: 0, value: 'По дате (по убыванию)' },
  { id: 1, value: 'По дате (по возрастанию)' },
  { id: 2, value: 'По номеру (по убыванию)' },
  { id: 3, value: 'По номеру (по возрастанию)' },
];

export { DocumentListScreen };

const localStyles = StyleSheet.create({
  actionIcon: {
    marginHorizontal: 10,
    width: 30,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    flex: 1,
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  field: {
    opacity: 0.5,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  iconSettings: {
    width: 36,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  swipeViewItem: {
    flexDirection: 'row',
    width: 120,
  },
});
