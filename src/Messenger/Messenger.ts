import { ipcMain, ipcRenderer, BrowserWindow } from "electron";

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

  public sendMessage(window: BrowserWindow, reciever: ComponentRecievers) {
    window.webContents.send(reciever, null);
  }
}

/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper
 * in the BaseComponent class.
 */
export class ComponentMessenger {
  // Responding function when the Manager requests deconstruction of the object.
  private onDeconstruct: Function;

  // Responding function when the manager requests the component to reload.
  private onReload: Function;

  // Responding function when the manager sends the component config.
  private onConfig: Function;

  /**
   * Intakes event responders for the Component class. This class should only be used in ComponentBase.
   * @param deconstructor The component deconstructor should be used here. Will be called upon recieving request from ComponentManager.
   * @param reloader The component Reloader should be used here. Will be called upon recieving request from ComponentManager.
   */
  constructor(deconstructor: Function, reloader: Function) {
    // Set responders
    this.onDeconstruct = deconstructor;
    this.onReload = reloader;

    // Create a close reciever
    ipcRenderer.on(ComponentRecievers.Close, (event, args) => {
      this.onConfig;
    });

    // Create a reload reciever
    ipcRenderer.on(ComponentRecievers.Reload, (event, args) => {
      this.onReload;
    });

    // Create a close reciever
    ipcRenderer.on(ComponentRecievers.Close, (event, args) => {
      this.onDeconstruct;
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
  Reload = "Reload",
  Close = "Close",
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
