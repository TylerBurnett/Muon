import { ipcMain, ipcRenderer, BrowserWindow } from "electron";
import { IComponentSettings } from "../Component/IComponentSettings";

/**
 * This class is both the listener and sender of events to Components
 * This class should be used in the Component Manager only
 */
export class ManagerMessenger {
  constructor() {
    // Create a reciever for errors
    ipcMain.on(ManagerRecievers.Error, (event, args) => {
      console.log("ERROR in:  " + <string>args[0] + ", " + <string>args[1]);
    });

    // Create a reciever for warnings
    ipcMain.on(ManagerRecievers.Warning, (event, args) => {
      console.log("WARNING in:  " + <string>args[0] + ", " + <string>args[1]);
    });

    // Create a reciever for logging
    ipcMain.on(ManagerRecievers.Log, (event, args) => {
      console.log(<string>args[0] + ": " + <string>args[1]);
    });
  }

  public sendMessage(
    window: BrowserWindow,
    reciever: ComponentRecievers,
    args: string
  ) {
    window.webContents.send(reciever, args);
  }
}

/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper
 * in the BaseComponent class.
 */
export class ComponentMessenger {
  /**
   * Intakes event responders for the Component class. This class should only be used in ComponentBase.
   * @param deconstructor The component deconstructor should be used here. Will be called upon recieving request from ComponentManager.
   * @param reloader The component Reloader should be used here. Will be called upon recieving request from ComponentManager.
   */
  constructor(onConfig: Function) {
    // Create a config reciever
    ipcRenderer.on(ComponentRecievers.Config, (event, args) => {
      onConfig(<IComponentSettings>args);
    });
  }

  /**
   * This function should be wrapped by a ComponentBase Function to ensure correct component name passing.
   * @param header The enum header that specifies the intent of the message
   * @param sender The caller component name.
   * @param message Additonal information, Used primarily when using Log, Warning, Error.
   */
  public sendMessage(
    header: ComponentRecievers,
    sender: string,
    message?: string
  ) {
    const args = [sender, message];
    ipcRenderer.send(header, args);
  }
}

/**
 * This enumerator is used for specifying the intent of a message to a component
 * This should be used in the case of: ComponentManager --> Component Messaging.
 * Note: A component will only react to these headers.
 */
export enum ComponentRecievers {
  Config = "Config",
}

/**
 * This enumerator is used for specifying the intent of a message to the Component Manager
 * This should be used in the case of: Component --> ComponentManager Messaging.
 * Note: The component manager will only react to these headers.
 */
export enum ManagerRecievers {
  Error = "Error",
  Warning = "Warning",
  Log = "Log",
}
