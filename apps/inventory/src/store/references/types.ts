export interface IReference {
  name: string;
}

export type IRefState = {
  readonly data: IReference[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IRefPayload = Partial<{
  errorMessage: string;
  data: IReference[];
}>;
