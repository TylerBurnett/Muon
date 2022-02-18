import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from 'winston';
import ClientService from '../Services/ClientService';

export default class IPCHandler {
  logger: Logger;

  client: ClientService;

  constructor(
    private channel: string,
    private protectedChannel: boolean,
    logger: Logger,
    client: ClientService
  ) {
    this.logger = logger;
    this.client = client;
    ipcMain.handle(this.channel, (event, args) =>
      this.authenticateCall(event, args)
    );
  }

  /**
   * Parent Middleware for authenticating proctected routes. DO NOT OVERRIDE.
   * @param event event dispatched passthrough.
   * @param args event args passthrough.
   */
  private authenticateCall(event: IpcMainInvokeEvent, args: unknown[]) {
    if (!this.protectedChannel || event.sender.id === this.client.getId())
      return this.handleEvent(event, args);

    this.logger.warning(
      `Component ${event.sender.getTitle()} tried to use protected API`
    );
    return undefined;
  }

  /**
   * Default method for event handling. OVERRIDE THIS METHOD.
   * @param event passthrough event
   * @param args passthrough args
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEvent(_event: IpcMainInvokeEvent, _args: unknown[]) {
    this.logger.error(
      `API Channel ${this.channel} has no override handler implemented.`
    );
  }
}
