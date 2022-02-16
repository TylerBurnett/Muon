import { app, Tray, Menu } from 'electron';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import ClientService from './ClientService';
import { getAssetPath } from '../Common/util';
import LoggerService from './LoggerService';
import SystemTrayService from './SystemTrayService';

@singleton()
export default class SystemTrayServiceImpl implements SystemTrayService {
  readonly path = getAssetPath('/icons/32x32.png');

  private tray: Tray | undefined;

  private log: Logger;

  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') private client: ClientService
  ) {
    this.log = logger.logger;
    const menu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        type: 'normal',
        click: () => this.client.startApp(),
      },
      { label: 'Exit', type: 'normal', click: () => app.exit(0) },
    ]);

    app
      .whenReady()
      .then(() => {
        this.tray = new Tray(this.path);
        this.tray.setContextMenu(menu);
        return undefined;
      })
      .catch((e) =>
        this.log.error('App failed to ready in TrayServiceImpl', e)
      );
  }
}
