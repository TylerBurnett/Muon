import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import { ComponentConfig } from '../Data/ComponentConfig';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetComponentConfig extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('SetComponentConfig', true, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [ComponentConfig]) {
    const [config] = args;

    this.components.updateComponentConfig(config);
    return this.components.getComponentConfig(config.uuid);
  }
}
