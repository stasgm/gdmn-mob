// import React from 'react';
// import { v4 as uuid } from 'uuid';
// import { AppScreen } from '@lib/mobile-ui';
// import { INamedEntity } from '@lib/types';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

// import { OrdersStackParamList } from '../../navigation/Root/types';

// import SelectItemReference from './SelectItemScreen';

// const SelectItemScreen1 = () => {
//   const navigation = useNavigation();

//  // const { docId, name } = useRoute<RouteProp<OrdersStackParamList, 'SelectItem'>>().params;

//   const handleSelectItem = (item: INamedEntity) => {
//     navigation.navigate('OrderLine', {
//       mode: 0,
//       docId,
//       item: { id: uuid(), good: { id: item.id, name: item.name }, quantity: 0 },
//     });
//   };

//   return <AppScreen>{/* <SelectItemReference name={name} onSelectItem={handleSelectItem} /> */}</AppScreen>;
// };

// export default SelectItemScreen1;
