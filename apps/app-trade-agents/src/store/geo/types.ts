import { INamedEntity } from '@lib/types';

export interface ICoords {
  latitude: number;
  longitude: number;
}

export interface ILocation extends INamedEntity {
  number: number;
  coords: ICoords;
}

export type GeoState = {
  readonly list: ILocation[];
  readonly currentPoint?: ILocation;
  readonly loading: boolean;
  readonly errorMessage: string;
};
