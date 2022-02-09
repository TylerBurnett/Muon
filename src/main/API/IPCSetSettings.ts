import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import { ApplicationSettings } from '../Data/ApplicationSettings';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetSettings extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ApplicationSettingsService')
    private app: ApplicationSettingsService
  ) {
    super('SetSettings', true, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [ApplicationSettings]) {
    const [settings] = args;
    this.app.updateApplicationSettings(settings);
    return this.app.getApplicationSettings();
  }
}
