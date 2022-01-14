import { useSelector } from '../';

const selectLoading = () => {
  return useSelector(
    (state) => state.documents.loadingData || state.references.loadingData || state.settings.loadingData,
  );
};

export default { selectLoading };
