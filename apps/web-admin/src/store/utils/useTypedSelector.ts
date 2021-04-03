import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { AppState } from '../index';

const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;

export default useTypedSelector;
