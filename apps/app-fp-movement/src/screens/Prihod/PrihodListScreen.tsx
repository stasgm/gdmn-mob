import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { documentActions, useDocThunkDispatch, useSelector } from '@lib/store';
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
  navBackDrawer,
  SimpleDialog,
  SendButton,
  FilterButtons,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor, useSendDocs } from '@lib/mobile-hooks';

import { IDelList } from '@lib/mobile-types';

import { IMoveDocument } from '../../store/types';
import { PrihodStackParamList } from '../../navigation/Root/types';

export interface PrihodListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, PrihodListSectionProps>[];

export const PrihodListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<PrihodStackParamList, 'PrihodList'>>();
  const docDispatch = useDocThunkDispatch();

  const list = (
    useSelector((state) => state.documents.list)?.filter(
      (i) => i.documentType?.name === 'movement' && i.head?.subtype.id === 'prihod',
    ) as IMoveDocument[]
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

  const handleAddDocument = useCallback(() => {
    navigation.navigate('PrihodEdit');
  }, [navigation]);

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
      Object.keys(delList).reduce((prev: IMoveDocument[], cur) => {
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
          <AddButton onPress={handleAddDocument} />
        )}
      </View>
    ),
    [handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `${Object.values(delList).length}` : 'Приходы',
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
            : navigation.navigate('PrihodView', { id: item.id })
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
