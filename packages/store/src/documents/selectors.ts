// import { useSelector } from 'react-redux';

import { useSelector } from '../';

const selectByDocType = (docType: string) => {
  return useSelector((state) => state.documents.list.filter((i) => i.documentType.name === docType));
};

export default { selectByDocType };
