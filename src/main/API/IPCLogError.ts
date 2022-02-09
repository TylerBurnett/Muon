import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCLogError extends IPCHandler {
  constructor(
    @inject('Logger') logger: Logger,
    @inject('ClientService') client: ClientService
  ) {
    super('LogError', false, logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [string, string]) {
    const [name, message] = args;

    this.logger.warning(`Error in:  ${name}, ${message}`);
  }
}
