import { Reducer } from 'redux';
import { getType } from 'typesafe-actions';

import { actions, MsgActionType } from './actions';

import { MessagesState } from './types';

export const initialState: Readonly<MessagesState> = {
  loading: false,
  errorMessage: '',
  multipartData: {},
  loadingData: false,
  loadingError: '',
};

const reducer: Reducer<MessagesState, MsgActionType> = (state = initialState, action): MessagesState => {
  switch (action.type) {
    case getType(actions.init):
      return initialState;

    case getType(actions.setLoadingData):
      return { ...state, loadingData: action.payload };

    case getType(actions.setLoadingError):
      return {
        ...state,
        loadingError: action.payload,
      };

    case getType(actions.loadData):
      return { ...action.payload, loading: false, errorMessage: '' };

    case getType(actions.addMultipartMessage):
      return {
        ...state,
        multipartData: {
          ...state.multipartData,
          [action.payload.multipartId]: {
            lastLoadDate: new Date(),
            messages: (state.multipartData[action.payload.multipartId]
              ? state.multipartData[action.payload.multipartId].messages.filter(
                  (m) => m.multipartSeq !== action.payload.multipartSeq,
                )
              : []
            ).concat(action.payload),
          },
        },
      };

    case getType(actions.removeMultipartItem): {
      const { [action.payload]: _, ...rest } = state.multipartData;
      return {
        ...state,
        multipartData: rest,
      };
    }

    default:
      return state;
  }
};

export default reducer;
