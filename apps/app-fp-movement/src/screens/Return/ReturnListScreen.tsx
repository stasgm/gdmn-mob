import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

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
  SimpleDialog,
  SendButton,
  AppActivityIndicator,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor, useSendDocs } from '@lib/mobile-hooks';

import { IDelList } from '@lib/mobile-types';

import { IReturnDocument } from '../../store/types';
import { ReturnStackParamList } from '../../navigation/Root/types';

export interface ReturnListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, ReturnListSectionProps>[];

export const ReturnListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReturnStackParamList, 'ReturnList'>>();
  const docDispatch = useDocThunkDispatch();

  const list = (
    useSelector((state) => state.documents.list)?.filter((i) => i.documentType?.name === 'return') as IReturnDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const loading = useSelector((state) => state.app.loading);

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
          title: i.head.fromDepart?.name || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}` || '',
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
          sentDate: i.sentDate,
        }) as IListItemProps,
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

  const [visibleSendDialog, setVisibleSendDialog] = useState(false);

  const docsToSend = useMemo(
    () =>
      Object.keys(delList).reduce((prev: IReturnDocument[], cur) => {
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
          <AddButton onPress={() => navigation.navigate('ReturnEdit')} />
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
      title: isDelList ? `${Object.values(delList).length}` : 'Возвраты',
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
            : navigation.navigate('ReturnView', { id: item.id })
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

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
