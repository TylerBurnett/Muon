import { IpcMainInvokeEvent } from 'electron';
import { Logger } from 'winston';
import { inject, singleton } from 'tsyringe';
import { ComponentSettings } from '../Data/ApplicationSettings';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetComponentSettings extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ApplicationSettingsService')
    private app: ApplicationSettingsService
  ) {
    super('SetComponentSettings', true, logger, client);
  }

  // TODO finish this endpoint
  handleEvent(_event: IpcMainInvokeEvent, args: [ComponentSettings]) {
    const [settings] = args;

    return this.app.getComponentSettings(settings.uuid);
  }
}
