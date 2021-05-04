export interface IReference {
  name: string;
}

export type IReferenceState = {
  readonly list: IReference[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
