import { IBaseUrl, ICompany, IDevice, IUser } from '@lib/types';

export type IAuthState = {
  readonly user: IUser | null | undefined;
  readonly device: IDevice | null | undefined;
  readonly company: ICompany | null | undefined;
  readonly settings: IBaseUrl | undefined;
  readonly loading: boolean;
  readonly error: boolean;
  readonly status: string;
};

// TODO: заменить на  IResponse<ICompany>
export type CompanyPayload = Partial<{
  errorMessage: string;
  companyData: ICompany;
}>;

// TODO: заменить на  IResponse<IDevice>
export type DevicePayload = Partial<{
  errorMessage: string;
  deviceData: IDevice | null;
}>;

// TODO: заменить на  IResponse<IUser>
export type UserPayload = Partial<{
  errorMessage: string;
  userData: IUser;
}>;
