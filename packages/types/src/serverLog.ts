import { ISystemFile } from './files';

export type ServerLogFile = ISystemFile;

export type ServerInfo = {
  memoryUsage: { rss: number; heapTotal: number; heapUsed: number; external: number; arrayBuffers: number };
  cpuUsage: {
    user: string;
    system: string;
  };
  processUptime: string;
};
