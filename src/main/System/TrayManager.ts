import { app, Tray, Menu } from 'electron';
import ComponentManager from '../ComponentManager/ComponentManager';

export default class TrayManager {
  private static tray: Tray;

  public static addTrayIcon(path: string) {
    this.tray = new Tray(path);

    const menu = Menu.buildFromTemplate([
      { label: 'Settings', type: 'normal', click: this.openSettings },
      { label: 'Exit', type: 'normal', click: this.exit },
    ] as any[]);

    this.tray.setContextMenu(menu);
  }

  private static openSettings() {
    ComponentManager.startApp();
  }

  private static exit() {
    app.exit(0);
  }
}
