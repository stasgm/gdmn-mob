import { CmdNameSyncRequest, ISyncRequest } from '@lib/types';

let orderCounter = new Date().getTime();

export const getNextOrder = () => ++orderCounter;

export const MULTIPART_ITEM_LIVE_IN_MS = 3600000;

export const REPEAT_REQUEST_TIME_IN_MS = 3600000;

export const needRequest = (syncRequests: ISyncRequest[], cmdName: CmdNameSyncRequest, currentDate: Date) => {
  const syncReq = syncRequests.find((req) => req.cmdName === cmdName);
  return (
    !syncReq || (syncReq?.date && currentDate.getTime() - new Date(syncReq.date).getTime() > REPEAT_REQUEST_TIME_IN_MS)
  );
};
