import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  AppActivityIndicator,
  Menu,
  DeleteButton,
  CloseButton,
  EmptyList,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDelList, getDateString, keyExtractor, deleteSelectedItems } from '@lib/mobile-app';

import { IDocumentType } from '@lib/types';

import { IDelList, IListItem } from '@lib/mobile-types';

import { ISellbillDocument } from '../../store/types';
import { SellbillStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';
import { dateTypes, docDepartTypes, statusTypes } from '../../utils/constants';

export interface SellbillListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, SellbillListSectionProps>[];

export const SellbillListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillList'>>();
  const dispatch = useDispatch();

  const docs = useSelector((state) => state.documents.list) as ISellbillDocument[];

  const list = docs?.filter((i) => i.documentType?.name === 'shipment' || i.documentType.name === 'currShipment');

  const [sortDateType, setSortDateType] = useState(dateTypes[0]);

  const [filterStatus, setFilterStatus] = useState<Status>('all');

  const documentTypes: IListItem[] = refSelectors
    .selectByName<IDocumentType>('documentType')
    ?.data?.filter((i) => i.subtype === 'shipment' && i.name !== 'freeShipment')
    .map((i) => ({ id: i.name, value: i.description || i.name }));

  const filterDocTypes = useMemo(() => docDepartTypes.concat(documentTypes), [documentTypes]);

  const [filterDocType, setFilterDocType] = useState(filterDocTypes[0]);

  const [visibleDocTypeMenu, setVisibleDocTypeMenu] = useState(false);

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      filterStatus === 'all'
        ? list
        : filterStatus === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : filterStatus !== 'archive' && filterStatus !== 'all'
        ? list.filter((e) => e.status === filterStatus)
        : [];

    const newRes = filterDocType?.id === 'all' ? res : res?.filter((i) => i?.documentType.name === filterDocType?.id);

    newRes.sort((a, b) =>
      sortDateType.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    );

    return newRes.map(
      (i) =>
        ({
          id: i.id,
          title: i.documentType.description || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IListItemProps),
    );
  }, [filterStatus, list, filterDocType?.id, sortDateType.id]);

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

  const [visibleFilterType, setVisibleFilterType] = useState(false);
  const [visibleFilterStatus, setVisibleFilterStatus] = useState(false);
  const [visibleSortDate, setVisibleSortDate] = useState(false);

  const handleApplyFilterType = useCallback((option) => {
    setVisibleFilterType(false);
    setFilterDocType(option);
  }, []);

  const handleApplyFilterStatus = useCallback((option) => {
    setVisibleFilterStatus(false);
    setFilterStatus(option.id);
  }, []);

  const handleApplySortDate = useCallback((option) => {
    setVisibleSortDate(false);
    setSortDateType(option);
  }, []);

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      dispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, dispatch]);

  const handleAddDocument = useCallback(
    (item: IListItem) => {
      setVisibleDocTypeMenu(false);
      navigation.navigate('ScanOrder', { id: item.id });
    },
    [navigation],
  );

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <View style={localStyles.menuDocType}>
            <Menu
              key={'MenuType'}
              visible={visibleDocTypeMenu}
              onChange={handleAddDocument}
              onDismiss={() => setVisibleDocTypeMenu(false)}
              onPress={() => setVisibleDocTypeMenu(true)}
              options={documentTypes}
              iconName={'plus'}
              iconSize={30}
            />
          </View>
        )}
      </View>
    ),
    [documentTypes, handleAddDocument, handleDeleteDocs, isDelList, visibleDocTypeMenu],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title:
        delList && Object.values(delList).length > 0
          ? `Выделено отвесов: ${Object.values(delList).length}`
          : 'Отвесы по заявкам',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => (
    <ScreenListItem
      key={item.id}
      {...item}
      onPress={() =>
        isDelList
          ? setDelList(getDelList(delList, item.id, item.status!))
          : navigation.navigate('SellbillView', { id: item.id })
      }
      onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
      checked={!!delList[item.id]}
    />
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <View style={[styles.containerCenter, styles.marginBottom5]}>
        <Menu
          key={'MenuType'}
          title="Тип"
          visible={visibleFilterType}
          onChange={handleApplyFilterType}
          onDismiss={() => setVisibleFilterType(false)}
          onPress={() => setVisibleFilterType(true)}
          options={filterDocTypes}
          activeOptionId={filterDocType?.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          isActive={filterDocType?.id !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuStatus'}
          title="Статус"
          visible={visibleFilterStatus}
          onChange={handleApplyFilterStatus}
          onDismiss={() => setVisibleFilterStatus(false)}
          onPress={() => setVisibleFilterStatus(true)}
          options={statusTypes}
          activeOptionId={filterStatus}
          style={[styles.btnTab]}
          menuStyle={localStyles.menu}
          isActive={filterStatus !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuDataSort'}
          title="Дата"
          visible={visibleSortDate}
          onChange={handleApplySortDate}
          onDismiss={() => setVisibleSortDate(false)}
          onPress={() => setVisibleSortDate(true)}
          options={dateTypes}
          activeOptionId={sortDateType.id}
          style={[styles.btnTab, styles.lastBtnTab]}
          menuStyle={localStyles.menu}
          isActive={sortDateType.id !== 'new'}
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
  menu: {
    justifyContent: 'center',
    marginLeft: 6,
    width: '100%',
  },
  menuDocType: {
    marginRight: 6,
  },
});
