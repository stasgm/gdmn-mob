import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { Alert, ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
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

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { IDocumentType } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { ISellbillDocument } from '../../store/types';
import { SellbillStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';
import { dateTypes, docDepartTypes, statusTypes } from '../../utils/constants';

export interface SellbillListSectionProps {
  title: string;
}

export interface IDelList {
  [id: string]: any;
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
    .map((i) => ({ id: i.name, value: i.description || '' }));

  const filterDocTypes = useMemo(() => docDepartTypes.concat(documentTypes), [documentTypes]);

  const [filterDocType, setFilterDocType] = useState(filterDocTypes[0]);

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

  const [visibleType, setVisibleType] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);

  const handleApplyType = useCallback((option) => {
    setVisibleType(false);
    setFilterDocType(option);
  }, []);

  const handleApplyStatus = useCallback((option) => {
    setVisibleStatus(false);
    setFilterStatus(option.id);
  }, []);

  const handleApplyDate = useCallback((option) => {
    setVisibleDate(false);
    setSortDateType(option);
  }, []);

  const [delList, setDelList] = useState({});

  const handleAddDeletelList = useCallback(
    (lineId: string, lineStatus: string, checkedId: string) => {
      if (checkedId) {
        const newList = Object.entries(delList).reduce((prev: IDelList, [curId, curStatus]) => {
          if (curId !== checkedId) {
            prev[curId] = curStatus;
          }
          return prev;
        }, {});
        setDelList(newList);
      } else {
        setDelList({ ...delList, [lineId]: lineStatus });
      }
    },
    [delList],
  );

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);
    const statusList = Object.values(delList).find((i) => i === 'READY' || i === 'SENT');

    if (statusList) {
      Alert.alert('Внимание!', 'Среди выделенных документов есть необработанные документы. Продолжить удаление?', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    } else {
      Alert.alert('Вы уверены, что хотите удалить документы?', '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  }, [delList, dispatch]);

  const handleAddDocument = useCallback(
    (item: IListItem) => {
      setVisible(false);
      navigation.navigate('ScanOrder', { id: item.id });
    },
    [navigation],
  );

  const [visible, setVisible] = useState(false);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {delList && Object.values(delList).length > 0 ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <Menu
            key={'MenuType'}
            visible={visible}
            onChange={handleAddDocument}
            onDismiss={() => setVisible(false)}
            onPress={() => setVisible(true)}
            options={documentTypes}
            iconName={'plus'}
            iconSize={30}
          />
        )}
      </View>
    ),
    [delList, documentTypes, handleAddDocument, handleDeleteDocs, visible],
  );

  const renderLeft = useCallback(
    () => delList && Object.values(delList).length > 0 && <CloseButton onPress={() => setDelList([])} />,
    [delList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: delList && Object.values(delList).length > 0 ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title:
        delList && Object.values(delList).length > 0
          ? `Выделено отвесов: ${Object.values(delList).length}`
          : 'Отвесы по заявкам',
    });
  }, [delList, navigation, renderLeft, renderRight]);

  const handlePressSellbill = (id: string) => navigation.navigate('SellbillView', { id });

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const checkedId = (delList && Object.keys(delList).find((i) => i === item.id)) || '';
    return (
      <ScreenListItem
        key={item.id}
        {...item}
        onSelectItem={() => handlePressSellbill(item.id)}
        onCheckItem={() => handleAddDeletelList(item.id, item.status || '', checkedId)}
        isChecked={checkedId ? true : false}
        isDelList={delList && Object.values(delList).length > 0 ? true : false}
      />
    );
  };

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
          visible={visibleType}
          onChange={handleApplyType}
          onDismiss={() => setVisibleType(false)}
          onPress={() => setVisibleType(true)}
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
          visible={visibleStatus}
          onChange={handleApplyStatus}
          onDismiss={() => setVisibleStatus(false)}
          onPress={() => setVisibleStatus(true)}
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
          visible={visibleDate}
          onChange={handleApplyDate}
          onDismiss={() => setVisibleDate(false)}
          onPress={() => setVisibleDate(true)}
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
});
