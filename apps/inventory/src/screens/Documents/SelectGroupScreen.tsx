import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';

import { DocumentsStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodGroup } from '../../store/types';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const keyStore = 'Order/GoodGroup';

const Group = ({
  item,
  expendGroup,
  setExpend,
}: {
  item: IGoodGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<DocumentsStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<DocumentsStackParamList, 'SelectGroupItem'>>().params;

  const goods = refSelectors.selectByName<IGood>('good').data.filter((good) => good.goodgroup.id === item.id);
  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const groups = refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>;

  const nextLevelGroups = groups.data.filter((group) => group.parent?.id === item.id);

  const isExpand = expendGroup === item.id || !!nextLevelGroups.find((group) => group.id === expendGroup);

  const icon = (nextLevelGroups.length === 0 ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon;

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ group }: { group: IGoodGroup }) => (
    <Group key={group.id} item={group} expendGroup={expendGroup} setExpend={setExpend} />
  );

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          nextLevelGroups.length > 0
            ? setExpend(!isExpand ? item : undefined)
            : navigation.navigate('SelectGoodItem', {
                docId,
                groupId: item.id,
              })
        }
      >
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          {nextLevelGroups.length === 0 && (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
              <Text style={styles.field}>{goods.length}</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name={icon} size={24} color="black" />
      </TouchableOpacity>
      {isExpand && (
        <View style={localStyles.marginLeft}>
          {nextLevelGroups.length > 0 && (
            <FlatList
              ref={refListGroups}
              data={nextLevelGroups}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item: group }) => renderGroup({ group })}
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
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const firstLevelGroups = groups.data.filter((item) => !item.parent);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem(keyStore);
        if (value !== null) {
          const expandGroup = groups.data.find((group) => group.id === value);
          setExpend(expandGroup);
        }
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, [navigation, colors.card, groups.data]);

  useEffect(() => {
    const storeData = async () => {
      try {
        expend ? await AsyncStorage.setItem(keyStore, expend.id) : await AsyncStorage.removeItem(keyStore);
      } catch (e) {
        // saving error
      }
    };

    storeData();
  }, [expend]);

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = ({ item }: { item: IGoodGroup }) => (
    <Group item={item} expendGroup={expend?.id} setExpend={setExpend} />
  );

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{groups.description || groups.name}</SubTitle>
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
