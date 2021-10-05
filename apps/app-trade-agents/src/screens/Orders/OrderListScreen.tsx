import React, { useCallback, useState, useLayoutEffect, useMemo, useRef } from 'react';
import {
  Animated,
  ListRenderItem,
  RefreshControl,
  SectionList,
  SectionListData,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  useActionSheet,
  AddButton,
  DrawerButton,
  MenuButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
} from '@lib/mobile-ui';

import { StatusType } from '@lib/types';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RectButton } from 'react-native-gesture-handler';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IOrderDocument } from '../../store/types';

import { getDateString } from '../../utils/helpers';

// eslint-disable-next-line import/no-cycle
import OrderListItem from './components/OrderListItem';

export interface OrderListItemProps {
  title: string;
  documentDate: string;
  subtitle?: string;
  status?: StatusType;
  isFromRoute?: boolean;
  lineCount?: number;
}
export interface OrderListRenderItemProps extends OrderListItemProps {
  id: string;
  // onPress: (id: string) => void;
}

export interface OrderListProps {
  orders: OrderListRenderItemProps[];
}

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<OrderListRenderItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.documents);

  const list = docSelectors
    .selectByDocType<IOrderDocument>('order')
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [status, setStatus] = useState<Status>('all');

  const filteredList: OrderListRenderItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list.filter((e) => e.status === 'PROCESSED')
        : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.outlet?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
        } as OrderListRenderItemProps),
    );
  }, [status, list]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = item.documentDate;
        const sectionExists = prev.some(({ title }) => title === sectionTitle);
        if (sectionExists) {
          return prev.map((section) =>
            section.title === sectionTitle ? { ...section, data: [...section.data, item] } : section,
          );
        }

        return [
          ...prev,
          {
            title: sectionTitle,
            data: [item],
          },
        ];
      }, []),
    [filteredList],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddDocument]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddDocument} />
        </View>
      ),
    });
  }, [actionsMenu, handleAddDocument, navigation]);

  const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

  let ref = useRef(null);

  const updateRef = (_ref: any) => {
    ref = _ref;
  };

  const renderRightActions = (progress: unknown, id: string, isBlocked: boolean) => (
    <View style={localStyles.swipeViewItem}>
      {renderRightAction('edit', 'file-document-edit', '#ffab00', 120, progress, id)}
      {renderRightAction('copy', 'content-copy', '#00aaff', 120, progress, id)}
      {renderRightAction('delete', 'delete-forever', '#dd2c00', 60, progress, id, isBlocked)}
    </View>
  );

  const renderRightAction = (
    name: string,
    icon: any,
    color: any,
    x: any,
    progress: any,
    id: string,
    isBlocked?: boolean,
  ) => {
    const trans: Animated.AnimatedInterpolation = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [x, 0, 1],
    });

    const pressHandler = (id: string, isBlocked?: boolean) => {
      if (name === 'edit') {
        navigation.navigate('OrderView', { id });
      } else if (name === 'delete') {
        if (isBlocked) {
          return Alert.alert('Внимание!', 'Документ не может быть удален', [{ text: 'OK' }]);
        }

        Alert.alert('Вы уверены, что хотите удалить документ?', '', [
          {
            text: 'Да',
            onPress: async () => {
              dispatch(documentActions.removeDocument(id));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
      (ref as unknown as Swipeable).close();
    };

    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[localStyles.rightAction, { backgroundColor: color }]}
          onPress={() => pressHandler(id, isBlocked)}
        >
          <AnimatedIcon name={icon} size={30} color="#fff" style={localStyles.actionIcon} />
        </RectButton>
      </Animated.View>
    );
  };

  const renderItem: ListRenderItem<OrderListRenderItemProps> = ({ item }) => {
    return (
      <Swipeable
        friction={2}
        renderRightActions={(progress) => renderRightActions(progress, item.id, item?.status !== 'DRAFT')}
        ref={updateRef}
      >
        <OrderListItem {...item} />
      </Swipeable>
    );
  };

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={{ marginBottom: 5 }} />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => (
          <SubTitle style={[styles.header, { backgroundColor: '#ddd', paddingVertical: 5 }]}>{section.title}</SubTitle>
        )}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  actionIcon: {
    marginHorizontal: 10,
    width: 30,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  swipeViewItem: {
    flexDirection: 'row',
    width: 120,
  },
});

export default OrderListScreen;
