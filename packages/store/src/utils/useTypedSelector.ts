import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../index';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
