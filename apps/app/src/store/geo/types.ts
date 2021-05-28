export interface ILocation {
  id: string;
  name: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}
// export interface ILoadingState {
//   readonly loading: boolean;
//   readonly errorMessage: string;
// }

export type IGeoState = {
  readonly list: ILocation[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
