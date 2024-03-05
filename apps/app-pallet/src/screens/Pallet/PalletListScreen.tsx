import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { SectionList, ListRenderItem, SectionListData, View, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';

import {
  globalStyles as styles,
  AppScreen,
  ItemSeparator,
  Status,
  SubTitle,
  AddButton,
  ScreenListItem,
  IListItemProps,
  FilterButtons,
  DeleteButton,
  CloseButton,
  EmptyList,
  SearchButton,
  MediumText,
  navBackDrawer,
} from '@lib/mobile-ui';

import { documentActions, refSelectors, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, generateId, getDateString, getDelList, keyExtractor } from '@lib/mobile-hooks';

import { IDelList } from '@lib/mobile-types';

import { IDocumentType, IReference } from '@lib/types';

import { IPalletDocument } from '../../store/types';
import { PalletStackParamList } from '../../navigation/Root/types';
import { getEan13Barcode, getNextDocNumber } from '../../utils/helpers';

import { BarcodeImage } from './components/Barcode';

export interface DocListProps {
  orders: IListItemProps[];
}

interface IFilteredList {
  searchQuery: string;
  list: IPalletDocument[];
}

export interface PalletListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IListItemProps, PalletListSectionProps>[];

export const PalletListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<PalletStackParamList, 'PalletList'>>();
  const docDispatch = useDocThunkDispatch();

  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  // const list = useSelector((state) => state.documents.list).filter(
  //   (i) => i.documentType?.name === 'scan',
  // ) as IPalletDocument[];

  // const list = (
  //   useSelector((state) => state.documents.list)?.filter((i) => i.documentType?.name === 'scan') as IPalletDocument[]
  // ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());
  const list = useSelector((state) => state.documents.list) as IPalletDocument[];

  const newNumber = useMemo(() => getNextDocNumber(list), [list]);
  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      docDispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, docDispatch]);

  const scanType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'pallet');

  const handleAddDocument = useCallback(() => {
    if (!scanType) {
      Alert.alert('Ошибка!', 'Тип документа не найден!', [
        {
          text: 'ОК',
        },
      ]);
      return;
    } else {
      const docId = generateId();
      const palletId = getEan13Barcode();

      const createdDate = new Date().toISOString();

      const newDoc: IPalletDocument = {
        id: docId,
        documentType: scanType,
        number: newNumber.trim(),
        documentDate: createdDate,
        status: 'DRAFT',
        head: {
          palletId,
        },
        lines: [],
        creationDate: createdDate,
        editionDate: createdDate,
      };
      dispatch(documentActions.addDocument(newDoc));

      navigation.navigate('PalletView', { id: newDoc.id });
    }
  }, [dispatch, navigation, newNumber, scanType]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
            <AddButton onPress={handleAddDocument} />
          </>
        )}
      </View>
    ),
    [filterVisible, handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено документов: ${Object.values(delList).length}` : 'Сканирование',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    list,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          list: list
            .filter((i) => i.documentType.name === 'pallet')
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()),
        });
      }
    }, [list, searchQuery]),
  );

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          list: list
            .filter((i) => i.documentType.name === 'pallet')
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()),
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = ({ head, documentDate, number }: IPalletDocument) =>
          head.department?.name?.toLowerCase().includes(lower) ||
          number.toLowerCase().includes(lower) ||
          getDateString(documentDate).toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.list.filter(fn);
        } else {
          const newList = list
            .filter((i) => i.documentType.name === 'pallet')
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());
          gr = newList.filter(fn);
        }

        setFilteredList({
          searchQuery,
          list: gr,
        });
      }
    }
  }, [filteredList, searchQuery, list]);

  const [status, setStatus] = useState<Status>('all');

  const newFilteredList: IListItemProps[] = useMemo(() => {
    if (!filteredList.list.length) {
      return [];
    }
    const res =
      status === 'all'
        ? filteredList.list
        : status === 'active'
          ? filteredList.list.filter((e) => e.status !== 'PROCESSED')
          : status === 'archive'
            ? filteredList.list.filter((e) => e.status === 'PROCESSED')
            : [];

    return res.map((i) => {
      return {
        id: i.id,
        title: `${i.documentType.description} ` || '',
        documentDate: getDateString(i.documentDate),
        status: i.status,
        documentType: i.documentType.name,
        lineCount: i.lines?.length,
        errorMessage: i.errorMessage,
        sentDate: i.sentDate,
        erpCreationDate: i.erpCreationDate,
        children: <BarcodeImage barcode={i?.head.palletId} />,
      } as IListItemProps;
    });
  }, [filteredList.list, status]);

  const sections = useMemo(
    () =>
      newFilteredList?.reduce<SectionDataProps>((prev, item) => {
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
    [newFilteredList],
  );

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list?.find((r) => r.id === item.id);

    return doc ? (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('PalletView', { id: item.id })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
        addInfo={
          <View>
            {doc.head.department && <MediumText>{doc.head.department.name}</MediumText>}
            <MediumText>
              № {doc.number} на {getDateString(doc.documentDate)}
            </MediumText>
          </View>
        }
      />
    ) : null;
  };

  const renderSectionHeader = useCallback(
    ({ section }: any) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
  );

  // const A = useCallback(() => {
  //   return <Barcode value="123456789999" options={{ format: 'code128' }} renderer={Renderer.image} />;
  // }, []);

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
      {/* <ScrollView style={{ flexDirection: 'column', marginVertical: 3, paddingVertical: 3 }}> */}
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <BarcodeGen value="123456789999" options={{ format: 'UPC', background: 'white' }} />
        </View> */}

      {/*///////////////////////////////////////////////////////////////*/}
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
      {/* <Barcode value="ABC123" /> */}
      {/* <A /> */}
      {/* <Barcode value="123456789999" options={{ format: 'code128' }} renderer={Renderer.image} /> */}

      {/* <Barcode
            value="Hello World"
            format="EAN13"
            background="#FFFFFF"
            height={40}
            lineColor="#000"
            textColor="#000"
            width={80}
          /> */}
      {/* <BarcodeCreatorViewManager
          value={'100'}
          background={'#000000'}
          foregroundColor={'#FFFFFF'}
          format={BarcodeFormat.EAN13}
          style={styles.box}
        /> */}

      {/* </View> */}
      {/*///////////////////////////////////////////////////////////////*/}
      {/* </ScrollView> */}

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
