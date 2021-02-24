import { Reducer, useReducer, useMemo } from 'react';

import { TActions } from './';

/**
 * Create an action that has a strongly typed string literal name with a strongly typed payload
 */
export function createActionPayload<TypeAction, TypePayload>(
  actionType: TypeAction,
): (payload: TypePayload) => ActionsWithPayload<TypeAction, TypePayload> {
  return (p: TypePayload): ActionsWithPayload<TypeAction, TypePayload> => {
    return {
      payload: p,
      type: actionType,
    };
  };
}

/**
 * Create an action with no payload
 */
export function createAction<TypeAction>(actionType: TypeAction): () => ActionsWithoutPayload<TypeAction> {
  return (): ActionsWithoutPayload<TypeAction> => {
    return {
      type: actionType,
    };
  };
}
/**
 * Create an action with a payload
 */
export interface ActionsWithPayload<TypeAction, TypePayload> {
  type: TypeAction;
  payload: TypePayload;
}

/**
 * Create an action that does not have a payload
 */
export interface ActionsWithoutPayload<TypeAction> {
  type: TypeAction;
}

/**
 * A very general type that means to be "an object with a many field created with createActionPayload and createAction
 */
interface ActionCreatorsMapObject {
  [key: string]: (...args: unknown[]) => ActionsWithPayload<unknown, unknown> | ActionsWithoutPayload<unknown>;
}

/**
 * Use this Type to merge several action object that has field created with createActionPayload or createAction
 * E.g. type ReducerWithActionFromTwoObjects = ActionsUnion<typeof ActionsObject1 &amp; typeof ActionsObject2>;
 */
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

/* export const makeActionCreators = (dispatch, fns) => {
  return Object.entries(fns).reduce((hash, [name, fn]) => {
    hash[name] = (...args) => dispatch(fn(...args));
    return hash;
  }, {});
}
 */

interface IAction {
  [key: string]: (...args: unknown[]) => unknown;
}

export function useTypesafeActions<S, Actions extends IAction>(
  reducer: Reducer<S, TActions>,
  initialState: S,
  actions: Actions,
): [S, Actions] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const boundActions = useMemo(() => {
    function bindActionCreator(actionCreator: (...args: unknown[]) => unknown, dispatcher: typeof dispatch) {
      return function (this: unknown) {
        // eslint-disable-next-line prefer-rest-params
        return dispatcher(actionCreator.apply(this, (arguments as unknown) as unknown[]));
      };
    }

    const newActions = Object.keys(actions).reduce((ba, actionName) => {
      ba[actionName] = bindActionCreator(actions[actionName], dispatch);
      return ba;
    }, {} as IAction);
    return newActions;
  }, [actions, dispatch]);

  return [state, boundActions as Actions];
}
