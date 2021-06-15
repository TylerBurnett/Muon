import { app, Tray, Menu, MenuItem, BrowserWindow } from 'electron';
import ComponentManager from '../ComponentManager/ComponentManager';

export default class TrayManager {
  private static tray: Tray;

  public static addTrayIcon() {
    this.tray = new Tray(`${__dirname}/trayIcon.png`);

    const menu = Menu.buildFromTemplate([
      { label: 'Settings', type: 'normal', click: this.openSettings },
      { label: 'Edit Mode', type: 'normal', click: this.editMode },
      { type: 'separator' },
      { label: 'Exit', type: 'normal', click: this.exit },
    ] as any[]);

    this.tray.setContextMenu(menu);
  }

  private static openSettings(
    _menuItem: MenuItem,
    _BrowserWindow: BrowserWindow,
    _event: Event
  ) {
    const manager = ComponentManager.getManager();
    manager.loadInterface();
  }

  private static editMode(
    _menuItem: MenuItem,
    _BrowserWindow: BrowserWindow,
    _event: Event
  ) {
    const manager = ComponentManager.getManager();
    const currSettings = manager.getSettings();
    manager.updateSettings(
      JSON.stringify({
        editMode: !currSettings.editMode,
      }),
      true
    );
  }

  private static exit(
    _menuItem: MenuItem,
    _BrowserWindow: BrowserWindow,
    _event: Event
  ) {
    app.exit(0);
  }
}
