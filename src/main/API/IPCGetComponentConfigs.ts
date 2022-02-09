import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCGetComponentConfigs extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('GetComponentConfigs', true, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, _args: unknown[]) {
    return this.components.getComponentConfigs();
  }
}
