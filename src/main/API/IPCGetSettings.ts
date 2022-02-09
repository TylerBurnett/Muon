import { IpcMainInvokeEvent } from 'electron';
import { Logger } from 'winston';
import { inject, singleton } from 'tsyringe';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCGetSettings extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ApplicationSettingsService')
    private app: ApplicationSettingsService
  ) {
    super('GetSettings', true, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, _args: unknown[]) {
    return this.app.getApplicationSettings();
  }
}
