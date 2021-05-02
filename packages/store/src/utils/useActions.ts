import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreator } from 'redux';

const useActions = <T extends ActionCreator<any>>(actions: T) => {
  const dispatch = useDispatch();

  return bindActionCreators(actions, dispatch);
};

export default useActions;
