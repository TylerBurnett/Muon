import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCLogError extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService
  ) {
    super('LogError', false, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [string, string]) {
    const [name, message] = args;

    this.logger.warning(`Error in:  ${name}, ${message}`);
  }
}
