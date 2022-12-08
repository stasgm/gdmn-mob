import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { documentActions, refSelectors, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  DeleteButton,
  CloseButton,
  EmptyList,
  MediumText,
  Menu,
  navBackDrawer,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor } from '@lib/mobile-hooks';

import { INamedEntity } from '@lib/types';

import { IDelList, IListItem } from '@lib/mobile-types';

import { IMoveDocument } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { dateTypes, docDepartTypes, statusTypes } from '../../utils/constants';

export interface MoveListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, MoveListSectionProps>[];

export const MoveListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveList'>>();
  const docDispatch = useDocThunkDispatch();

  const list = (
    useSelector((state) => state.documents.list)?.filter((i) => i.documentType?.name === 'movement') as IMoveDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const [date, setDate] = useState(dateTypes[0]);

  const [status, setStatus] = useState<Status>('all');

  const documentSubtypes = refSelectors
    .selectByName<INamedEntity>('documentSubtype')
    ?.data?.map((i) => ({ id: i.id, value: i.name }));

  const docTypes = useMemo(() => docDepartTypes.concat(documentSubtypes), [documentSubtypes]);

  const [type, setType] = useState(docTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status !== 'archive' && status !== 'all'
        ? list.filter((e) => e.status === status)
        : [];

    const newRes = type?.id === 'all' ? res : res?.filter((i) => i?.head.subtype.id === type?.id);

    newRes.sort((a, b) =>
      date.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    );

    return newRes.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.subtype.name || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,

          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
          addInfo: (
            <View>
              <MediumText>Откуда: {i.head.fromDepart?.name || ''}</MediumText>
              <MediumText>Куда: {i.head.toDepart?.name || ''}</MediumText>
              <MediumText>
                № {i.number} на {getDateString(i.documentDate)}
              </MediumText>
            </View>
          ),
        } as IListItemProps),
    );
  }, [status, list, type?.id, date.id]);

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

  const [visibleType, setVisibleType] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);

  const handleApplyType = (option: IListItem) => {
    setVisibleType(false);
    setType(option);
  };

  const handleApplyStatus = (option: any) => {
    setVisibleStatus(false);
    setStatus(option.id);
  };

  const handleApplyDate = (option: IListItem) => {
    setVisibleDate(false);
    setDate(option);
  };

  const handleAddDocument = useCallback(() => {
    navigation.navigate('MoveEdit');
  }, [navigation]);

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
        {isDelList ? <DeleteButton onPress={handleDeleteDocs} /> : <AddButton onPress={handleAddDocument} />}
      </View>
    ),
    [handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено документов: ${Object.values(delList).length}` : 'Перемещение',
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
            : navigation.navigate('MoveView', { id: item.id })
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
      <View style={[styles.containerCenter, localStyles.container]}>
        <Menu
          key={'MenuType'}
          title="Тип"
          visible={visibleType}
          onChange={handleApplyType}
          onDismiss={() => setVisibleType(false)}
          onPress={() => setVisibleType(true)}
          options={docTypes}
          activeOptionId={type.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          isActive={type.id !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuStatus'}
          title="Статус"
          visible={visibleStatus}
          onChange={handleApplyStatus}
          onDismiss={() => setVisibleStatus(false)}
          onPress={() => setVisibleStatus(true)}
          options={statusTypes}
          activeOptionId={status}
          style={[styles.btnTab]}
          menuStyle={localStyles.menu}
          isActive={status !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuDataSort'}
          title="Дата"
          visible={visibleDate}
          onChange={handleApplyDate}
          onDismiss={() => setVisibleDate(false)}
          onPress={() => setVisibleDate(true)}
          options={dateTypes}
          activeOptionId={date.id}
          style={[styles.btnTab, styles.lastBtnTab]}
          menuStyle={localStyles.menu}
          isActive={date.id !== 'new'}
          iconName={'chevron-down'}
        />
      </View>
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

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  menu: {
    justifyContent: 'center',
    marginLeft: 6,
    width: '100%',
  },
});
