import { UserDto } from '@lib/types';

export const makeProfile = (user: UserDto) => ({
  id: user.id,
  externalId: user.externalId,
  userName: user.userName,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  companies: user.companies,
  creatorId: user.creatorId,
});
