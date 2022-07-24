import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { Alert, ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { Searchbar } from 'react-native-paper';

import { documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  FilterButtons,
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
  SearchButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { IDocumentType, IReference } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { ISellbillDocument } from '../../store/types';
import { SellbillStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

// import { getBarcode } from '../../utils/helpers';

export interface SellbillListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, SellbillListSectionProps>[];

export const SellbillListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillList'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const sellbills = useSelector((state) => state.documents.list) as ISellbillDocument[];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = sellbills
    ?.filter(
      (i) => i.documentType?.name === 'otves' || i.documentType.name === 'otvesCurr',
      //     ? i?.head?.contact.name || i?.head?.outlet.name || i.number || i.documentDate
      //       ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
      //         i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
      //         i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
      //         getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase())
      //       : true
      //     : false,
    )
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

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
          title: i.documentType.description || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
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
  const [delList, setDelList] = useState({});

  const handleAddDeletelList = useCallback(
    (lineId: string, lineStatus: string, checkedId: string) => {
      if (checkedId) {
        const newList = Object.entries(delList).reduce((sum, cur) => {
          const curId = cur[0];
          const curStatus = cur[1];
          if (curId !== checkedId) {
            return { ...sum, [curId]: curStatus };
          } else {
            return { ...sum };
          }
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
      navigation.navigate('ScanOrder', { id: item.id });
      setVisible(false);
    },
    [navigation],
  );

  const typesRef: IDocumentType[] = refSelectors.selectByName<IReference<IDocumentType>>('documentType')?.data;

  const typeList: IListItem[] = typesRef
    .filter((i) => i.isShip && i.name !== 'shipFree')
    .map((i) => ({ id: i.name, value: i.description || '' }));

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {delList && Object.values(delList).length > 0 ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
            <Menu
              key={'MenuType'}
              visible={visible}
              onChange={handleAddDocument}
              onDismiss={() => setVisible(false)}
              onPress={() => setVisible(true)}
              options={typeList}
              iconName={'plus'}
              iconSize={30}
            />
          </>
        )}
      </View>
    ),
    [delList, filterVisible, handleAddDocument, handleDeleteDocs, typeList, visible],
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

  const handlePressSellbill = useCallback((id: string) => navigation.navigate('SellbillView', { id }), [navigation]);

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
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={colors.primary}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        // refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};
