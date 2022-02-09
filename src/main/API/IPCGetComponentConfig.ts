import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCGetComponentConfig extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService
  ) {
    super('GetComponentConfig', true, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [string]) {
    const [uuid] = args;
    return this.components.getComponentConfig(uuid);
  }
}
