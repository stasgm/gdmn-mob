import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  ItemSeparator,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  DeleteButton,
  CloseButton,
  EmptyList,
  MediumText,
  navBackDrawer,
  SendButton,
  SimpleDialog,
  AddButton,
  AppActivityIndicator,
  Status,
  FilterButtons,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDelList, getDateString, keyExtractor, deleteSelectedItems, useSendDocs } from '@lib/mobile-hooks';

import { IDelList, IListItem } from '@lib/mobile-types';

// import { TouchableOpacity } from 'react-native-gesture-handler';

import { MD2Theme, useTheme } from 'react-native-paper';

import { ICellMovementDocument, ICellMovementHead, IReceiptDocument } from '../../store/types';
import { CellMovementStackParamList } from '../../navigation/Root/types';

export interface ShipmentListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, ShipmentListSectionProps>[];

export const CellMovementListScreen = () => {
  const route = useRoute();
  const isCurr = route.name.toLowerCase().includes('curr');
  const navigation = useNavigation<StackNavigationProp<CellMovementStackParamList, 'CellMovementList'>>();
  const docDispatch = useDocThunkDispatch();

  const isFocused = useIsFocused();
  const { colors } = useTheme<MD2Theme>();

  const docs = useSelector((state) => state.documents.list) as (ICellMovementDocument | IReceiptDocument)[];
  const loading = useSelector((state) => state.app.loading);

  const [status, setStatus] = useState<Status>('all');

  const dataTypes: IListItem[] = [
    {
      id: 'movement',
      value: 'Перемещение',
    },
    {
      id: 'prihod',
      value: 'Накладные',
    },
  ];

  const [filterType, setFilterType] = useState<IListItem>(dataTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    const list = docs?.filter((i) => i.documentType.subtype === 'was') || [];
    const res = list.filter((i) => i.documentType.name === filterType.id);

    res.sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

    return res.map((i) => {
      const head: any = i.head;
      const movementHead = head as ICellMovementHead | undefined;

      return {
        id: i.id,
        title: `${i.head.documentSubtype?.name || ''}, № ${i.number}`,
        documentDate: getDateString(i.documentDate),
        status: i.status,
        lineCount: i.lines.length,
        errorMessage: i.errorMessage,
        addInfo: (
          <View>
            {/* Cell movement: from/to departments */}
            {movementHead?.fromDepartment?.name || movementHead?.toDepartment?.name ? (
              <>
                {movementHead.fromDepartment?.name && (
                  <MediumText>{`Откуда: ${movementHead.fromDepartment.name}`}</MediumText>
                )}
                {movementHead.toDepartment?.name && (
                  <MediumText>{`Куда: ${movementHead.toDepartment.name}`}</MediumText>
                )}
              </>
            ) : (
              /* Receipt or other docs: contact/department if present */
              <>
                {head.contact?.name && <MediumText>{head.contact.name}</MediumText>}
                {head.department?.name && <MediumText>{head.department.name}</MediumText>}
              </>
            )}
          </View>
        ),
        sentDate: i.sentDate,
        erpCreationDate: i.erpCreationDate,
      } as IListItemProps;
    });
  }, [docs, filterType.id]);

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

  // const [visibleFilterType, setVisibleFilterType] = useState(false);
  // const [visibleFilterStatus, setVisibleFilterStatus] = useState(false);
  // const [visibleSortDate, setVisibleSortDate] = useState(false);

  // const handleApplyFilterType = (option: any) => {
  //   setVisibleFilterType(false);
  //   setFilterType(option);
  // };

  // const handleApplyFilterStatus = (option: any) => {
  //   setVisibleFilterStatus(false);
  //   setFilterStatus(option);
  // };

  // const handleApplySortDate = (option: IListItem) => {
  //   setVisibleSortDate(false);
  //   setSortDateType(option);
  // };

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

  const handleAddDocument = useCallback(() => {
    navigation.navigate('CellMovementEdit');
  }, [navigation]);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const docsToSend = useMemo(
    () =>
      Object.keys(delList).reduce((prev: ICellMovementDocument[], cur) => {
        const sendingDoc = docs.find((i) => i.id === cur && (i.status === 'DRAFT' || i.status === 'READY'));
        if (sendingDoc) {
          prev = [...prev, sendingDoc];
        }
        return prev;
      }, []),
    [delList, docs],
  );

  const sendDoc = useSendDocs(docsToSend.length ? docsToSend : []);

  const handleSendDocument = useCallback(async () => {
    setVisibleSendDialog(false);
    // setScreenState('sending');
    await sendDoc();
    setDelList({});

    // setScreenState('sent');
  }, [sendDoc]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <View style={styles.buttons}>
            <SendButton onPress={() => setVisibleSendDialog(true)} />
            <DeleteButton onPress={handleDeleteDocs} />
          </View>
        ) : (
          <AddButton onPress={handleAddDocument} />
        )}
      </View>
    ),
    [handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(
    () =>
      isDelList && (
        <CloseButton
          onPress={() => {
            setDelList({});
          }}
        />
      ),
    [isDelList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title:
        delList && Object.values(delList).length > 0
          ? `${Object.values(delList).length}`
          : isCurr
            ? 'Отвес $'
            : 'Отвес',
    });
  }, [delList, isDelList, isCurr, navigation, renderLeft, renderRight]);

  const handleSetDelList = useCallback(
    (item: IListItemProps) => {
      setDelList(getDelList(delList, item.id, item.status!));
    },
    [delList],
  );

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => (
    <ScreenListItem
      key={item.id}
      {...item}
      onPress={() => (isDelList ? handleSetDelList(item) : navigation.navigate('CellMovementView', { id: item.id }))}
      onLongPress={() => handleSetDelList(item)}
      checked={!!delList[item.id]}
    />
  );

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <View style={[styles.containerCenter, styles.marginBottom5]}>
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor="#DDDDDD"
          onPress={() => setFilterType(dataTypes[1])}
          style={[
            styles.btnTab,
            styles.firstBtnTab,
            { backgroundColor: filterType.id === 'prihod' ? colors.primary : colors.background },
          ]}
        >
          <Text
            style={[
              {
                color: filterType.id === 'prihod' ? colors.background : colors.primary,
              },
              localStyles.fontSize,
            ]}
          >
            Накладные
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor="#DDDDDD"
          onPress={() => setFilterType(dataTypes[0])}
          style={[
            styles.btnTab,
            styles.lastBtnTab,
            { backgroundColor: filterType.id === 'movement' ? colors.primary : colors.background },
          ]}
        >
          <Text
            style={[
              {
                color: filterType.id === 'movement' ? colors.background : colors.primary,
              },
              localStyles.fontSize,
            ]}
          >
            Перемещение
          </Text>
        </TouchableHighlight>
        {/* </TouchableOpacity> */}
        {/* <Icon name="chevron-down" size={24} color="black" /> */}
        {/* <Menu
          key={'MenuStatus'}
          title="Тип"
          visible={visibleFilterType}
          onChange={handleApplyFilterType}
          onDismiss={() => setVisibleFilterType(false)}
          onPress={() => setVisibleFilterType(true)}
          options={dataTypes}
          activeOptionId={filterType.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          // isActive={filterType.id !== 'all'}
          iconName={'chevron-down'}
        /> */}
        {/* <Menu
          key={'MenuStatus'}
          title="Тип"
          visible={visibleFilterStatus}
          onChange={handleApplyFilterStatus}
          onDismiss={() => setVisibleFilterStatus(false)}
          onPress={() => setVisibleFilterStatus(true)}
          options={statusTypes}
          activeOptionId={filterStatus.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          isActive={filterStatus.id !== 'all'}
          iconName={'chevron-down'}
        /> */}
        {/* <Menu
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
        /> */}
      </View>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />

      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
      />
      <SimpleDialog
        visible={visibleSendDialog}
        title={'Внимание!'}
        text={'Сформировано полностью?'}
        onCancel={() => setVisibleSendDialog(false)}
        onOk={handleSendDocument}
        okDisabled={loading}
      />
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  // menu: {
  //   justifyContent: 'center',
  //   marginLeft: 6,
  //   width: '100%',
  // },
  fontSize: { fontSize: 17 },
});
