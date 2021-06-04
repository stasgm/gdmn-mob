import { IEntity } from '@lib/types';

export type IVisitState = {
  readonly list: IVisit[];
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type typeTakeOrder = 'ONPLACE' | 'BYPHONE' | 'BYEMAIL';

export type typeVisit = 'ORDER' | 'REFUSE' | 'RETURN';

export interface ICoords {
  latitude: number;
  longitude: number;
}

export type resutVisit = 'DONE' | 'NOT DONE' | 'PART';
export interface IVisit extends IEntity {
  routeLineId: number;
  comment?: string;
  dateBegin: string; //начало визита
  dateEnd?: string; // конец визита
  beginGeoPoint: ICoords; //место начало визита
  endGeoPoint?: ICoords; // место завершения визита
  result?: resutVisit;
  takenType: typeTakeOrder; //тип визита - это поле забрать из заявки
}
