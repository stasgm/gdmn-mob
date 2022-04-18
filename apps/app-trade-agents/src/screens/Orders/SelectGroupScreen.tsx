import React, { useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';

import { getDateString } from '@lib/mobile-app';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IOrderDocument, IGoodGroup, IMGroupModel } from '../../store/types';
import { getGroupModelByContact } from '../../utils/helpers';
import { unknownGroup } from '../../utils/constants';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

interface IProp {
  model: IMGroupModel;
  item: IGoodGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
}

const Group = ({ model, item, expendGroup, setExpend }: IProp) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const nextLevelGroups = model[item.id]?.children?.map((gr) => gr.group) || [];

  const isExpand = expendGroup === item.id || !!nextLevelGroups?.find((group) => group.id === expendGroup);

  const icon = (nextLevelGroups?.length === 0 ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon;

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item: grItem }: { item: IGoodGroup }) => (
    <Group model={model} key={grItem.id} item={grItem} expendGroup={expendGroup} setExpend={setExpend} />
  );

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          nextLevelGroups?.length && nextLevelGroups?.length > 0
            ? setExpend(!isExpand ? item : undefined)
            : navigation.navigate('SelectGoodItem', {
                docId,
                groupId: item.id,
              })
        }
      >
        <View style={styles.details}>
          <Text style={styles.name}>{item.name || item.name}</Text>
          {nextLevelGroups?.length === 0 && (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
              <Text style={styles.field}>
                {model[item.parent?.id || '']?.children?.find((gr) => gr.group.id === item.id)?.goods?.length}
              </Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name={icon} size={24} color="black" />
      </TouchableOpacity>
      {isExpand && (
        <View style={localStyles.marginLeft}>
          {nextLevelGroups && nextLevelGroups?.length > 0 && (
            <FlatList
              ref={refListGroups}
              data={nextLevelGroups}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderGroup}
              ItemSeparatorComponent={ItemSeparator}
              ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
            />
          )}
        </View>
      )}
    </>
  );
};

const SelectGroupScreen = () => {
  const navigation = useNavigation();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;
  const dispatch = useDispatch();

  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data) as boolean;

  const syncDate = useSelector((state) => state.app.syncDate);

  useEffect(() => {
    if (syncDate && getDateString(syncDate) !== getDateString(new Date())) {
      return Alert.alert('Внимание!', 'В справочнике устаревшие данные, требуется синхронизация', [{ text: 'OK' }]);
    }
  }, [syncDate]);

  const contactId = docSelectors.selectByDocId<IOrderDocument>(docId)?.head.contact.id;

  const formParams = useSelector((state) => state.app.formParams);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const goods = refSelectors.selectByName<IGood>('good').data;

  const refGroup = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const groups = refGroup.data.concat(unknownGroup);

  const model = useMemo(
    () => getGroupModelByContact(groups, goods, goodMatrix[contactId], isUseNetPrice),
    [groups, goods, goodMatrix, contactId, isUseNetPrice],
  );

  const firstLevelGroups = useMemo(() => Object.values(model).map((item) => item.parent), [model]);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });

    if (formParams?.groupId) {
      const expandGroup = groups.find((group) => group.id === formParams.groupId);
      setExpend(expandGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, formParams?.groupId]);

  const handleSetExpand = (group: IGoodGroup | undefined) => {
    setExpend(group);
    dispatch(
      appActions.setFormParams({
        ...formParams,
        ['groupId']: group?.id,
      }),
    );
  };

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item }: { item: IGoodGroup }) => (
    <Group model={model} item={item} expendGroup={expend?.id} setExpend={(group) => handleSetExpand(group)} />
  );

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{refGroup.description || refGroup.name}</SubTitle>
      <Divider />
      <FlatList
        ref={refListGroups}
        data={firstLevelGroups}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderGroup}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
      />
    </AppScreen>
  );
};

export default SelectGroupScreen;

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 20,
  },
});
