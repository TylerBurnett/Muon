import { IpcMainInvokeEvent } from 'electron';

export interface IIPCEvent {
  channel: string;
  response: <Type>(event: IpcMainInvokeEvent, args: Type[]) => unknown;
}
