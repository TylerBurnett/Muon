import { ipcMain, BrowserWindow } from 'electron';
import { ComponentRecievers, ManagerRecievers } from '../Common/Recievers';
import { ComponentManager } from '../ComponentManager/ComponentManager';

/**
 * This class is both the listener and sender of events to Components
 * This class should be used in the Component Manager only
 */
export class ManagerMessenger {
  constructor() {
    // Create a reciever for errors
    ipcMain.on(ManagerRecievers.Error, (event, args) => {
      console.log('ERROR in:  ' + <string>args[0] + ', ' + <string>args[1]);
    });

    // Create a reciever for warnings
    ipcMain.on(ManagerRecievers.Warning, (event, args) => {
      console.log('WARNING in:  ' + <string>args[0] + ', ' + <string>args[1]);
    });

    // Create a reciever for logging
    ipcMain.on(ManagerRecievers.Log, (event, args) => {
      console.log(<string>args[0] + ': ' + <string>args[1]);
    });

    // Create a reciever for getting appConfig from the appSettingsComponent.
    ipcMain.on(ManagerRecievers.AppConfig, (event, args) => {
      let manager = ComponentManager.getManager();
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
    ipcMain.on(ManagerRecievers.GetComponents, (event, args) => {
      let manager = ComponentManager.getManager();
      manager.updateSettings(args[1]);

      event.returnValue(manager.components);
    });
  }

  public sendMessage(
    window: BrowserWindow,
    reciever: ComponentRecievers,
    args: any
  ) {
    window.webContents.send(reciever, [args]);
  }
}
