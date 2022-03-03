export interface Client {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    client: Client;
  }
}
