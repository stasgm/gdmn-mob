import { IEntity } from '@lib/types';

import { ICoords } from '../geo/types';

export type IVisitState = {
  readonly list: IVisit[];
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

export type VisitResultType = 'ALL_COMPLETED' | 'NOT_COMPLETED' | 'PARTLY_COMPLETED';

export interface IVisit extends IEntity {
  routeLineId: number;
  comment?: string;
  dateBegin: string; //начало визита
  dateEnd?: string; // конец визита
  beginGeoPoint: ICoords; //место начало визита
  endGeoPoint?: ICoords; // место завершения визита
  result?: VisitResultType;
  takenType: TakeOrderType; //тип визита - это поле забрать из заявки
}
