import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { documentActions, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  DeleteButton,
  CloseButton,
  EmptyList,
  navBackDrawer,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor } from '@lib/mobile-hooks';

import { IDelList } from '@lib/mobile-types';

import { ILaboratoryDocument } from '../../store/types';
import { LaboratoryStackParamList } from '../../navigation/Root/types';

export interface LaboratoryListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, LaboratoryListSectionProps>[];

export const LaboratoryListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<LaboratoryStackParamList, 'LaboratoryList'>>();
  const docDispatch = useDocThunkDispatch();

  const list = (
    useSelector((state) => state.documents.list)?.filter(
      (i) => i.documentType?.name === 'laboratory',
    ) as ILaboratoryDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const [status, setStatus] = useState<Status>('all');

  const filteredList: IListItemProps[] = useMemo(() => {
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
          title: i.head.depart.name || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}` || '',
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IListItemProps),
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

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      docDispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, docDispatch]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <AddButton onPress={() => navigation.navigate('LaboratoryEdit')} />
        )}
      </View>
    ),
    [handleDeleteDocs, isDelList, navigation],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено отвесов: ${Object.values(delList).length}` : 'Отвесы',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('LaboratoryView', { id: item.id })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
      />
    ),
    [delList, isDelList, navigation],
  );

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};
