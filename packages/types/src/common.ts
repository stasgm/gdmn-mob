// Базовые типы
export interface IEntity {
  id: string;
  creationDate?: string;
  editionDate?: string;
}

export interface INamedEntity extends IEntity {
  name: string;
}

export interface IExternalSystemProps {
  externalId?: string;
}

//
export type DeviceState = 'NON-REGISTERED' | 'NON-ACTIVATED' | 'ACTIVE' | 'BLOCKED';

export type UserRole = 'SuperAdmin' | 'Admin' | 'User';

export type StatusType =
  | 'DRAFT'
  | 'READY'
  | 'SENT'
  | 'PROCESSED'
  | 'ARCHIVE'
  | 'PROCESSED_INCORRECT'
  | 'PROCESSED_DEADLOCK';

export type BodyType = 'CMD' | 'REFS' | 'DOCS' | 'SETTINGS';
