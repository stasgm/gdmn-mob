import { INamedEntity } from '@lib/types';

export interface ILocation extends INamedEntity {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export type IGeoState = {
  readonly list: ILocation[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
