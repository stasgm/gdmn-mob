import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { IAppState } from './';

const useTypedSelector: TypedUseSelectorHook<IAppState> = useSelector;

export default useTypedSelector;
