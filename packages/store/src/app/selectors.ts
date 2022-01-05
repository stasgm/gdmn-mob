import { useSelector } from '../';

const selectLoading = () => {
  return useSelector(
    (state) => state.documents.loading || state.references.loading || state.settings.loading || state.app.loading,
  );
};

export default { selectLoading };
