import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import { BackButton, globalStyles as styles, InfoBlock, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { IApplDocument, IApplLine } from '../../store/types';

import { getDateString } from '../../utils/helpers';

import { ApplsStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import ApplItem from './components/ApplItem';

const ApplViewScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplView'>>();
  const { id } = useRoute<RouteProp<ApplsStackParamList, 'ApplView'>>().params;

  const appl = (docSelectors.selectByDocType('appl') as IApplDocument[])?.find((e) => e.id === id);

  const isBlocked = appl?.status !== 'DRAFT';

  const handleRefuse = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.deleteDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  const handleAccept = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.deleteDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  if (!appl) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IApplLine }) => <ApplItem docId={appl.id} item={item} />;

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(appl?.status || 'DRAFT')}
        title={appl.head.dept.name}
        // onPress={handleEditApplHead}
        disabled={!['DRAFT', 'READY'].includes(appl.status)}
      >
        <View style={styles.directionRow}>
          <Text>{`№ ${appl.number} от ${getDateString(appl.documentDate)}`} </Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
        data={appl.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ApplViewScreen;
