import { IUser } from '@lib/common-types';

export const makeProfile = (user: IUser) => ({
  id: user.id,
  externalId: user.externalId,
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  companies: user.companies,
  creatorId: user.creatorId,
});
