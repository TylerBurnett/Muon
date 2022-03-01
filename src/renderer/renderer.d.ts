import { IpcRenderer } from 'electron';

export interface Client {
  ipcRenderer: IpcRenderer;
}

declare global {
  interface Window {
    client: Client;
  }
}
