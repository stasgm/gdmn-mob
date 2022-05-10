import { ICompany } from '@lib/types';
import { superAdmin } from '@lib/mock';

import { applRefs } from './references';
import { applDocMetadata, applDocuments } from './documents';

const company: ICompany = { admin: superAdmin, id: '147100001', name: 'Белкалий - Агро' };

export { applDocMetadata, applDocuments, company, applRefs };
