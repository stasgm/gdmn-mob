import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  DrawerButton,
  FilterButtons,
  Status,
  AppScreen,
  SubTitle,
  MenuButton,
  useActionSheet,
} from '@lib/mobile-ui';

import { StatusType } from '@lib/types';

import { IApplDocument } from '../../store/types';

import { getDateString } from '../../utils/helpers';

import { shortenString } from '../../utils/stringOperations';

// eslint-disable-next-line import/no-cycle
import ApplListItem from './components/ApplListItem';

export interface ApplListItemProps {
  documentDate: string;
  title: string;
  subtitle?: string;
  description?: string;
  status?: StatusType;
  applStatus: string;
  isFromRoute?: boolean;
  lineCount?: number;
  errorMessage?: string;
}
export interface ApplListRenderItemProps extends ApplListItemProps {
  id: string;
  // onPress: (id: string) => void;
}

export interface ApplListProps {
  Appl: ApplListRenderItemProps[];
}

export interface ApplListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<ApplListRenderItemProps, ApplListSectionProps>[];

const renderItem: ListRenderItem<ApplListRenderItemProps> = ({ item }) => {
  return <ApplListItem {...item} />;
};

const ApplListScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.documents);

  const list = docSelectors
    .selectByDocType<IApplDocument>('Заявки на закупку ТМЦ')
    .filter((d) => !!d.head) //временно не выводить документы, если нет head
    .sort((a, b) => (a.number > b.number ? -1 : 1))
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [status, setStatus] = useState<Status>('all');

  const filteredList: ApplListRenderItemProps[] = useMemo(() => {
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
          title: i.head.dept.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          applStatus: `${i.head.applStatus.name} ${
            i.head.cancelReason ? '(' + shortenString(i.head.cancelReason, 50) + ')' : ''
          }`,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)}`,
          description: shortenString(i.head.justification, 90),
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as ApplListRenderItemProps),
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
    navigation.navigate('ApplView');
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
    });
  }, [handleAddDocument, navigation]);

  const handleReset = useCallback(() => {
    dispatch(documentActions.init());
  }, [dispatch]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      // {
      //   title: 'Загрузить',
      //   onPress: handleLoad,
      // },
      {
        title: 'Удалить все',
        type: 'destructive',
        onPress: handleReset,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleReset, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation, actionsMenu]);

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        // ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => <SubTitle style={[styles.header]}>{section.title}</SubTitle>}
        // refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default ApplListScreen;
