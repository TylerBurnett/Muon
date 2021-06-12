import { app, Tray, Menu, MenuItem, BrowserWindow } from "electron";
import { ComponentManager } from "../ComponentManager/ComponentManager";

export class TrayManager {
  private static tray: Tray;

  public static addTrayIcon() {
    this.tray = new Tray(__dirname + "/res/trayIcon.png");

    let menu = Menu.buildFromTemplate([
      { label: "Settings", type: "normal", click: this.openSettings },
      { label: "Edit Mode", type: "normal", click: this.editMode },
      { type: "separator" },
      { label: "Exit", type: "normal", click: this.exit },
    ] as any[]);

    this.tray.setContextMenu(menu);
  }

  private static openSettings(
    menuItem: MenuItem,
    BrowserWindow: BrowserWindow,
    event: Event
  ) {
    const manager = ComponentManager.getManager();
    manager.loadApplicationComponent();
  }

  private static editMode(
    menuItem: MenuItem,
    BrowserWindow: BrowserWindow,
    event: Event
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
    menuItem: MenuItem,
    BrowserWindow: BrowserWindow,
    event: Event
  ) {
    app.exit(0);
  }
}
