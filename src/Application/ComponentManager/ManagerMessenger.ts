import { ipcMain, BrowserWindow } from 'electron';
import { IComponentSettingsMeta } from '../Common/IComponentSettings';
import { ComponentRecievers, ManagerRecievers } from '../Common/Recievers';
// eslint-disable-next-line import/no-cycle
import ComponentManager from './ComponentManager';

/**
 * This class is both the listener and sender of events to Components
 * This class should be used in the Component Manager only
 */
export default class ManagerMessenger {
  constructor() {
    ManagerMessenger.buildComponentRecievers();
    ManagerMessenger.buildInterfaceRecievers();
  }

  /**
   * Sends messages to the relevant BrowserWindow.
   * @param window The BrowserWindow Context to use.
   * @param reciever The Event that the component is listening in on.
   * @param args Any arguments that the BrowserWindow expects.
   */
  public static sendMessage(
    window: BrowserWindow,
    reciever: ComponentRecievers,
    args: any
  ) {
    window.webContents.send(reciever, [args]);
  }

  /**
   * Builds all the receivers used by the ComponentAPI
   */
  private static buildComponentRecievers(): void {
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
  }

  /**
   * Builds all of the recievers used by the interface
   */
  private static buildInterfaceRecievers(): void {
    // Create a reciever for responding the components settings to interface.
    ipcMain.handle(ManagerRecievers.GetComponents, () => {
      const manager = ComponentManager.getManager();
      return manager.components;
    });

    // Create a reciever for responding the components settings to interface.
    ipcMain.handle(ManagerRecievers.GetComponent, (_event, args) => {
      const manager = ComponentManager.getManager();
      return manager.components.filter(
        (component) => component.uuid === args[0]
      );
    });

    // Create a reciever for responding the components settings to interface.
    ipcMain.handle(ManagerRecievers.SetComponent, (_event, args) => {
      console.log('Messaged recieved captain');
      const manager = ComponentManager.getManager();
      return manager.updateComponentSettings(<IComponentSettingsMeta>args[0]);
    });
  }
}
