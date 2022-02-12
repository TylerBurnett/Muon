import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import ComponentService from '../Services/ComponentService';
import { ComponentSettings } from '../Data/ApplicationSettings';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetComponentSettings extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService,
    @inject('ApplicationSettingsService')
    private app: ApplicationSettingsService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('SetComponentSettings', true, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [ComponentSettings]) {
    const [settings] = args;

    this.app.updateComponentSettings(settings);
    this.components.checkComponentStatus(settings.uuid);
    return this.app.getComponentSettings(settings.uuid);
  }
}
