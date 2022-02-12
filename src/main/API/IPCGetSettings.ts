import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCGetSettings extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService,
    @inject('ApplicationSettingsService')
    private app: ApplicationSettingsService
  ) {
    super('GetSettings', true, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, _args: unknown[]) {
    return this.app.getApplicationSettings();
  }
}
