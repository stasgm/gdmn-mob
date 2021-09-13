// import { ActionType } from 'typesafe-actions';

// import { ThunkDispatch } from 'redux-thunk';

// import { useDispatch } from 'react-redux';

// import { AppThunk } from '../types';

// import { GeoState, ILocation } from './types';

// import { actions, GeoActionType } from './actions';

// export type GeoDispatch = ThunkDispatch<GeoState, any, GeoActionType>;

// export const useGeoThunkDispatch = () => useDispatch<GeoDispatch>();

// export const addMany = (
//   locations: ILocation[],
// ): AppThunk<
//   Promise<ActionType<typeof actions.addManyAsync>>,
//   GeoActionType,
//   ActionType<typeof actions.addManyAsync>
// > => {
//   return async (dispatch) => {
//     dispatch(actions.addManyAsync.request(''));

//     try {
//       return dispatch(actions.addManyAsync.success(locations));
//     } catch {
//       return dispatch(actions.addManyAsync.failure('something wrong'));
//     }
//   };
// };

// export default { addMany, useGeoThunkDispatch };
