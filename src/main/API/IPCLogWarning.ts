import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCLogWarning extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService
  ) {
    super('LogWarning', false, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [string, string]) {
    const [name, message] = args;

    this.logger.warning(`Warning in:  ${name}, ${message}`);
  }
}
