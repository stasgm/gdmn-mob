import { INamedEntity } from '@lib/types';

export interface ILocation extends INamedEntity {
  number: number;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export type IGeoState = {
  readonly list: ILocation[];
  readonly currentPoint?: ILocation;
  readonly loading: boolean;
  readonly errorMessage: string;
};
