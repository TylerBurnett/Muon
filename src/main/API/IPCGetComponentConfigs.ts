import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCGetComponentConfigs extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('GetComponentConfigs', true, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, _args: unknown[]) {
    return this.components.getComponentConfigs();
  }
}
