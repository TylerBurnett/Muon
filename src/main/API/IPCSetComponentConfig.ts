import { IpcMainInvokeEvent } from 'electron';
import { Logger } from 'winston';
import { inject, singleton } from 'tsyringe';
import { ComponentConfig } from '../Data/ComponentConfig';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetComponentConfig extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('SetComponentConfig', true, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [ComponentConfig]) {
    const [config] = args;

    this.components.updateComponentConfig(config);
    return this.components.getComponentConfig(config.uuid);
  }
}
