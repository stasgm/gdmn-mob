import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, refSelectors, useDocThunkDispatch, useSelector } from '@lib/store';
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

import { IDocumentType } from '@lib/types';

import { IDelList, IListItem } from '@lib/mobile-types';

import { IShipmentDocument } from '../../store/types';
import { CurrShipmentStackParamList, ShipmentStackParamList } from '../../navigation/Root/types';
import { dateTypes, statusTypes } from '../../utils/constants';

export interface ShipmentListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, ShipmentListSectionProps>[];

export const ShipmentListScreen = () => {
  const route = useRoute();
  const isShipmentList = useMemo(() => route.name === 'ShipmentList', [route.name]);

  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ShipmentList'>>();
  const navigationCurr = useNavigation<StackNavigationProp<CurrShipmentStackParamList, 'CurrShipmentList'>>();

  const docDispatch = useDocThunkDispatch();

  const docs = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const loading = useSelector((state) => state.app.loading);

  const list = docs?.filter((i) =>
    isShipmentList ? i.documentType?.name === 'shipment' : i.documentType?.name === 'currShipment',
  );

  const [sortDateType, setSortDateType] = useState(dateTypes[0]);

  const [filterStatus, setFilterStatus] = useState<IListItem>(
    statusTypes.find((i) => i.id === 'DRAFT_READY') || statusTypes[0],
  );

  const documentType = refSelectors
    .selectByName<IDocumentType>('documentType')
    ?.data?.find((i) => (isShipmentList ? i.name === 'shipment' : i.name === 'currShipment'))?.name;

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
        } as IListItemProps),
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
    // (item: IListItem) => {
    if (!documentType) {
      return;
    }

    isShipmentList
      ? navigation.navigate('ScanOrder', { docTypeId: documentType /*item.id*/, isShipment: isShipmentList })
      : navigationCurr.navigate('ScanOrder', { docTypeId: documentType /*item.id*/, isShipment: isShipmentList });
  }, [documentType, isShipmentList, navigation, navigationCurr]);

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

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    isShipmentList
      ? navigation.setOptions({
          headerLeft: isDelList ? renderLeft : navBackDrawer,
          headerRight: renderRight,
          title: delList && Object.values(delList).length > 0 ? `${Object.values(delList).length}` : 'Отвесы',
        })
      : navigationCurr.setOptions({
          headerLeft: isDelList ? renderLeft : navBackDrawer,
          headerRight: renderRight,
          title: delList && Object.values(delList).length > 0 ? `${Object.values(delList).length}` : 'Отвесы $',
        });
  }, [delList, isDelList, isShipmentList, navigation, navigationCurr, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => (
    <ScreenListItem
      key={item.id}
      {...item}
      onPress={() =>
        isDelList
          ? setDelList(getDelList(delList, item.id, item.status!))
          : isShipmentList
          ? navigation.navigate('ShipmentView', { id: item.id, isShipment: isShipmentList })
          : navigationCurr.navigate('ShipmentView', { id: item.id, isShipment: isShipmentList })
      }
      onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
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
