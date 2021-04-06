import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { IRootState } from '.';

const useCompanyTypedSelectors: TypedUseSelectorHook<IRootState> = useSelector;

export default useCompanyTypedSelectors;
