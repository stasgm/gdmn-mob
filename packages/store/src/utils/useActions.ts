import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreator, AnyAction } from 'redux';

const useActions = <T extends ActionCreator<AnyAction>>(actions: T) => {
  const dispatch = useDispatch();

  return bindActionCreators(actions, dispatch);
};

export default useActions;
