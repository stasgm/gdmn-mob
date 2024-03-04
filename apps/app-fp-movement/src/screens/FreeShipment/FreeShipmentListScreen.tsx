import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDocThunkDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  ItemSeparator,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  DeleteButton,
  CloseButton,
  EmptyList,
  navBackDrawer,
  SendButton,
  SimpleDialog,
  Menu,
  MediumText,
  AppActivityIndicator,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor, useSendDocs } from '@lib/mobile-hooks';

import { IDelList, IListItem } from '@lib/mobile-types';

import { IFreeShipmentDocument } from '../../store/types';
import { FreeShipmentStackParamList } from '../../navigation/Root/types';
import { dateTypes, statusTypes } from '../../utils/constants';

export interface FreeShipmentListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, FreeShipmentListSectionProps>[];

export const FreeShipmentListScreen = () => {
  const route = useRoute();
  const isCurr = route.name.toLowerCase().includes('curr');
  const navigation = useNavigation<StackNavigationProp<FreeShipmentStackParamList, 'FreeShipmentList'>>();
  const docDispatch = useDocThunkDispatch();

  const list = (
    useSelector((state) => state.documents.list)?.filter((i) =>
      isCurr ? i.documentType?.name === 'currFreeShipment' : i.documentType?.name === 'freeShipment',
    ) as IFreeShipmentDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const loading = useSelector((state) => state.app.loading);

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const [sortDateType, setSortDateType] = useState(dateTypes[0]);

  const [status, setStatus] = useState<IListItem>(statusTypes.find((i) => i.id === 'DRAFT_READY') || statusTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    const res = list.filter((e) => ((status.statuses as []) || []).find((i) => i === e.status));

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
              <MediumText>{i.head.fromDepart?.name || ''}</MediumText>
              <MediumText>
                № {i.number} на {getDateString(i.documentDate)}
              </MediumText>
            </View>
          ),
          sentDate: i.sentDate,
        }) as IListItemProps,
    );
  }, [list, status, sortDateType.id]);

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

  const [visibleStatus, setVisibleStatus] = useState(false);
  const [visibleSortDate, setVisibleSortDate] = useState(false);

  const handleApplyStatus = (option: any) => {
    setVisibleStatus(false);
    setStatus(option);
  };

  const handleApplySortDate = (option: IListItem) => {
    setVisibleSortDate(false);
    setSortDateType(option);
  };

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      docDispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, docDispatch]);

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const docsToSend = useMemo(
    () =>
      Object.keys(delList).reduce((prev: IFreeShipmentDocument[], cur) => {
        const sendingDoc = list.find((i) => i.id === cur && (i.status === 'DRAFT' || i.status === 'READY'));
        if (sendingDoc) {
          prev = [...prev, sendingDoc];
        }
        return prev;
      }, []),
    [delList, list],
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
          <AddButton onPress={() => navigation.navigate('FreeShipmentEdit', { isCurr })} />
        )}
      </View>
    ),
    [handleDeleteDocs, isCurr, isDelList, navigation],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `${Object.values(delList).length}` : isCurr ? 'Отвес $' : 'Отвес',
    });
  }, [delList, isCurr, isDelList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('FreeShipmentView', { id: item.id, isCurr })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
      />
    ),
    [delList, isCurr, isDelList, navigation],
  );

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <View style={[styles.containerCenter, styles.marginBottom5]}>
        <Menu
          key={'MenuStatus'}
          title="Статус"
          visible={visibleStatus}
          onChange={handleApplyStatus}
          onDismiss={() => setVisibleStatus(false)}
          onPress={() => setVisibleStatus(true)}
          options={statusTypes}
          activeOptionId={status.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          isActive={status.id !== 'all'}
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
