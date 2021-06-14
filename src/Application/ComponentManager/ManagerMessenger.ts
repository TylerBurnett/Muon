import { ipcMain, BrowserWindow } from 'electron';
import { ComponentRecievers, ManagerRecievers } from '../Common/Recievers';
// eslint-disable-next-line import/no-cycle
import ComponentManager from './ComponentManager';

/**
 * This class is both the listener and sender of events to Components
 * This class should be used in the Component Manager only
 */
export default class ManagerMessenger {
  constructor() {
    // Create a reciever for errors
    ipcMain.on(ManagerRecievers.Error, (_event, args) => {
      // eslint-disable-next-line no-console
      console.log(`ERROR in:  ${<string>args[0]}, ${<string>args[1]}`);
    });

    // Create a reciever for warnings
    ipcMain.on(ManagerRecievers.Warning, (_event, args) => {
      // eslint-disable-next-line no-console
      console.log(`WARNING in:  ${<string>args[0]}, ${<string>args[1]}`);
    });

    // Create a reciever for logging
    ipcMain.on(ManagerRecievers.Log, (_event, args) => {
      // eslint-disable-next-line no-console
      console.log(`${<string>args[0]}: ${<string>args[1]}`);
    });

    // Create a reciever for getting appConfig from the appSettingsComponent.
    ipcMain.on(ManagerRecievers.AppConfig, (_event, args) => {
      const manager = ComponentManager.getManager();
      manager.updateSettings(args[1]);
    });

    /*
      // Create a reciever for getting updated component settings from interface.
      ipcMain.on(ManagerRecievers.SetComponent, (event, args) => {
        let manager = ComponentManager.getManager();
        manager.updateSettings(args[1]);
      });
      */

    // Create a reciever for responding the components settings to interface.
    ipcMain.handle(ManagerRecievers.GetComponents, (event, args) => {
      const manager = ComponentManager.getManager();
      return manager.components;
    });

    // Create a reciever for responding the components settings to interface.
    ipcMain.on(ManagerRecievers.GetComponent, (event, args) => {
      const manager = ComponentManager.getManager();
      manager.updateSettings(args[1]);

      event.returnValue(manager.components);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public sendMessage(
    window: BrowserWindow,
    reciever: ComponentRecievers,
    args: any
  ) {
    window.webContents.send(reciever, [args]);
  }
}
