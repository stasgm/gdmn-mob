import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { IAppState } from '.';

const useCompanyTypedSelectors: TypedUseSelectorHook<IAppState> = useSelector;

export default useCompanyTypedSelectors;
