/* import { IDBUser, INamedEntity, IUser } from '@lib/types';

import { companyService, userService } from '../services'; */

/* export const makeUser = async (user: IDBUser): Promise<IUser> => {
  const companies: INamedEntity[] = [];

  user.companies.forEach(async (i) => {
    const company = await companyService.findOne(i);
    companies.push({
      id: company.id,
      name: company.name,
    });
  });

  const creator = await userService.findOne(user.creatorId);

  return {
    id: user.id,
    name: user.name,
    companies,
    role: user.role,
    creator,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    externalId: user.externalId,
    createDate: user.createDate,
    updateDate: user.updateDate,
  };
};
 */
