import { app, Tray, Menu } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from './ClientService';
import { getAssetPath } from '../Common/util';
import LoggerService from './LoggerService';

@singleton()
export default class TrayService {
  readonly path = `${getAssetPath()}/icons/32x32.png`;

  private tray: Tray | undefined;

  private log: Logger;

  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') private client: ClientService
  ) {
    this.log = logger.logger;
    const menu = Menu.buildFromTemplate([
      { label: 'Settings', type: 'normal', click: this.client.startApp },
      { label: 'Exit', type: 'normal', click: () => app.exit(0) },
    ]);

    app
      .whenReady()
      // eslint-disable-next-line promise/always-return
      .then(() => {
        this.tray = new Tray(this.path);
        this.tray.setContextMenu(menu);
      })
      .catch((e) => this.log.error(''));
  }
}
