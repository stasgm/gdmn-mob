import { existsSync, mkdirSync } from 'fs';

export const mkDir = (path: string) => {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
};
