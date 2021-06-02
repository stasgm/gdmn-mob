import { SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors } from '@lib/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-paper';

import { globalStyles as styles } from '@lib/mobile-ui';

import { INamedEntity, IReference } from '@lib/types';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IContact, IDebt, IOutlet, IRouteDocument } from '../../store/docs/types';

import { contactRefMock, outletRefMock } from '../../store/docs/mock';

const RouteDetailScreen = () => {
  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;

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

  return (
    <View>
      <SubTitle style={styles.title}>{point.outlet.name}</SubTitle>
      <Divider />
      <View>
        {outlet && (
          <>
            <Text>{outlet.address}</Text>
            <Text>{outlet.phoneNumber}</Text>
          </>
        )}
      </View>
      <Divider />
      <SubTitle style={styles.title}>{`Договор №${contact?.contractNumber} от ${contact?.contractDate}`}</SubTitle>
      <Divider />
      <View>
        {contact && (
          <>
            <Text>{contact.paycond}</Text>
            <Text>{`Задолженность ${debt.saldo}`}</Text>
          </>
        )}
      </View>

      {/*<View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>{point.outlet.name}</Text>
          <Text style={[styles.number, styles.field]}>{point.ordNumber}</Text>
        </View>
      </View>*/}
    </View>
  );
};

export default RouteDetailScreen;
