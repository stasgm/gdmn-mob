import { SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors } from '@lib/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

//import * as Location from 'expo-location';

import { globalStyles, globalStyles as styles } from '@lib/mobile-ui';

import { INamedEntity, IReference } from '@lib/types';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument } from '../../store/docs/types';

import { contactRefMock, outletRefMock } from '../../store/docs/mock';
import { useDispatch, useSelector } from '../../store';

import { visitActions } from '../../store/visits/actions';
import { ICoords, IVisit } from '../../store/visits/types';

import Visit from './components/Visit';

const RouteDetailScreen = () => {
  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;
  const visits = useSelector((state) => state.visits).list.filter((visit) => visit.routeLineId.toString() === id);

  const dispatch = useDispatch();
  //const ref = useRef<FlatList<IRouteLine>>(null);
  //useScrollToTop(ref);

  const [process, setProcess] = useState(false);

  const point = (docSelectors.selectByDocType('route') as IRouteDocument[])
    ?.find((e) => e.id === routeId)
    ?.lines.find((i) => i.id === id);

  if (!point) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>Визит не найден</SubTitle>
      </View>
    );
  }

  //TODO получить адрес item.outlet.id
  /*const outlet = point
    ? (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find((e) => e.id === point.outlet.id)
    : undefined;*/
  const outlet = (outletRefMock as unknown as IReference<IOutlet>).data?.find((item) => item.id === point.outlet.id);
  const contact = outlet
    ? (contactRefMock as unknown as IReference<IContact>).data?.find((item) => item.id === outlet?.company.id)
    : undefined;
  const debt: IDebt = {
    id: '1',
    contact: contact as INamedEntity,
    ondate: '01.12.2020',
    saldo: 1000,
    saldoDebt: 0,
  };

  const handleNewVisit = async () => {
    setProcess(true);

    /*const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setProcess(false);
      return;
    }

    const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });*/
    const date = new Date().toISOString();

    dispatch(
      visitActions.addOne({
        id: `${id}${date}`,
        routeLineId: Number(id),
        dateBegin: date,
        beginGeoPoint: { latitude: 53.89076, longitude: 27.551006 } as ICoords,
        //beginGeoPoint: (coords as unknown) as ICoords,
        takenType: 'ONPLACE',
      }),
    );

    setProcess(false);
  };

  //const renderItem = ({ item }: { item: IVisit }) => <VisitItem key={item.id} item={item} />;

  return (
    <View style={[styles.container, currStyles.content]}>
      <View style={[styles.flexDirectionRow, currStyles.box]}>
        <View style={currStyles.label} />
        <View style={currStyles.info}>
          <SubTitle style={[styles.title]}>{point.outlet.name}</SubTitle>
          {outlet && (
            <>
              <Text>{outlet.address}</Text>
              <Text>{`+375 ${outlet.phoneNumber}`}</Text>
            </>
          )}
        </View>
      </View>
      <View style={[styles.flexDirectionRow, currStyles.box]}>
        <View
          style={[
            currStyles.label,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: debt.saldo > 0 ? '#F80012' : '#00C322',
            },
          ]}
        />
        <View style={currStyles.info}>
          <SubTitle style={styles.title}>{`Договор №${contact?.contractNumber} от ${contact?.contractDate}`}</SubTitle>
          {contact && (
            <>
              <Text>{`Условия оплаты: ${contact.paycond}`}</Text>
              <Text>{`Задолженность: ${debt.saldo}`}</Text>
            </>
          )}
        </View>
      </View>
      {process ? (
        <ActivityIndicator size="large" color="#3914AF" />
      ) : visits.length > 0 ? (
        <>
          {visits.map((visit) => (
            <Visit
              key={visit.id}
              item={visit}
              outlet={outlet as INamedEntity}
              contact={contact as INamedEntity}
              road={{ id: routeId, name: '' }}
            />
          ))}
          {/*<SubTitle style={styles.title}>Визиты</SubTitle>
          <Divider />
          <FlatList
            ref={ref}
            data={visits}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            scrollEventThrottle={400}
            ItemSeparatorComponent={ItemSeparator}
          />*/}
        </>
      ) : (
        <Button onPress={handleNewVisit} mode="contained" style={[globalStyles.rectangularButton, currStyles.buttons]}>
          Начать визит
        </Button>
      )}
    </View>
  );
};

export default RouteDetailScreen;

const currStyles = StyleSheet.create({
  box: {
    borderColor: '#8888',
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  buttons: {
    width: '100%',
  },
  content: {
    justifyContent: 'flex-start',
  },
  info: {
    margin: 5,
    marginLeft: 15,
  },
  label: {
    width: 10,
    backgroundColor: '#3914AF',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
