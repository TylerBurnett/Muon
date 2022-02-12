import { IpcMainInvokeEvent } from 'electron';
import { inject, singleton } from 'tsyringe';
import LoggerService from '../Services/LoggerService';
import ClientService from '../Services/ClientService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCLogInfo extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService
  ) {
    super('LogInfo', false, logger.logger, client);
  }

  handleEvent(_event: IpcMainInvokeEvent, args: [string, string]) {
    const [name, message] = args;

    this.logger.info(`Info in:  ${name}, ${message}`);
  }
}
