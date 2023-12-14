import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  ItemSeparator,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  Menu,
  DeleteButton,
  CloseButton,
  EmptyList,
  MediumText,
  navBackDrawer,
  SendButton,
  SimpleDialog,
  AddButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDelList, getDateString, keyExtractor, deleteSelectedItems, useSendDocs } from '@lib/mobile-hooks';

import { IDelList, IListItem } from '@lib/mobile-types';

import { IShipmentDocument } from '../../store/types';
import { ShipmentStackParamList } from '../../navigation/Root/types';
import { dateTypes, statusTypes } from '../../utils/constants';
import { fpMovementActions, useSelector as useFpSelector } from '../../store';

export interface ShipmentListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, ShipmentListSectionProps>[];

export const ShipmentListScreen = () => {
  const route = useRoute();
  const isCurr = route.name.toLowerCase().includes('curr');
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentList'>>();
  const docDispatch = useDocThunkDispatch();

  const dispatch = useDispatch();

  const tempOrders = useFpSelector((state) => state.fpMovement.list);

  const docs = useSelector((state) => state.documents.list) as IShipmentDocument[];
  const loading = useSelector((state) => state.app.loading);

  const list = docs?.filter((i) =>
    isCurr ? i.documentType?.name === 'currShipment' : i.documentType?.name === 'shipment',
  );

  const [sortDateType, setSortDateType] = useState(dateTypes[0]);
  const [filterStatus, setFilterStatus] = useState<IListItem>(
    statusTypes.find((i) => i.id === 'DRAFT_READY') || statusTypes[0],
  );

  const filteredList: IListItemProps[] = useMemo(() => {
    const res = list.filter((e) => ((filterStatus.statuses as []) || []).find((i) => i === e.status));

    res.sort((a, b) =>
      sortDateType.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    );

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.documentType.description || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
          addInfo: (
            <View>
              <MediumText>{i.head.outlet?.name || ''}</MediumText>
              <MediumText>
                № {i.number} на {getDateString(i.head?.onDate)}
              </MediumText>
            </View>
          ),
        }) as IListItemProps,
    );
  }, [filterStatus, list, sortDateType.id]);

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

  const [visibleFilterStatus, setVisibleFilterStatus] = useState(false);
  const [visibleSortDate, setVisibleSortDate] = useState(false);

  const handleApplyFilterStatus = (option: any) => {
    setVisibleFilterStatus(false);
    setFilterStatus(option);
  };

  const handleApplySortDate = (option: IListItem) => {
    setVisibleSortDate(false);
    setSortDateType(option);
  };

  const [delList, setDelList] = useState<IDelList>({});
  const [delTempList, setDelTempList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);
    const tempIds = Object.keys(delTempList);

    const deleteDocs = () => {
      docDispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    const deleteTempOrders = () => {
      dispatch(fpMovementActions.removeTempOrders(tempIds));
      setDelTempList({});
    };

    deleteSelectedItems(delList, deleteDocs);
    deleteSelectedItems(delTempList, deleteTempOrders, true);
  }, [delList, delTempList, dispatch, docDispatch]);

  const handleAddDocument = useCallback(() => {
    navigation.navigate('ScanOrder', { isCurr });
  }, [isCurr, navigation]);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const docsToSend = useMemo(
    () =>
      Object.keys(delList).reduce((prev: IShipmentDocument[], cur) => {
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
    setDelTempList({});

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
            setDelTempList({});
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
      const shipment = list.find((i) => i.id === item.id);
      const temp = tempOrders.find((i) => i.orderId === shipment?.head?.orderId);
      if (temp) {
        setDelTempList(getDelList(delTempList, temp?.id, item.status!));
      }
    },
    [delList, delTempList, list, tempOrders],
  );

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => (
    <ScreenListItem
      key={item.id}
      {...item}
      onPress={() =>
        isDelList ? handleSetDelList(item) : navigation.navigate('ShipmentView', { id: item.id, isCurr })
      }
      onLongPress={() => handleSetDelList(item)}
      checked={!!delList[item.id]}
    />
  );

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  return (
    <AppScreen>
      <View style={[styles.containerCenter, styles.marginBottom5]}>
        <Menu
          key={'MenuStatus'}
          title="Статус"
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
  menu: {
    justifyContent: 'center',
    marginLeft: 6,
    width: '100%',
  },
});
