export type ConfigState = {
  readonly apiPath: string;
  readonly port: number;
  readonly protocol: string;
  readonly server: string;
  readonly timeout: number;
  readonly version: string | undefined;
  readonly deviceId: string | undefined;
  readonly loading: boolean;
  readonly error: boolean;
  readonly status: string;
};
