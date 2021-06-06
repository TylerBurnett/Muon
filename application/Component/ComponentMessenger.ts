const { ipcRenderer } = require("electron");
import { ComponentRecievers, ManagerRecievers } from "../Messenger/Messenger";
import { IComponentSettings } from "./IComponentSettings";

/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper
 * in the BaseComponent class.
 */ export class ComponentMessenger {
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
    header: ManagerRecievers,
    sender: string,
    message?: string
  ) {
    const args = [sender, message];
    ipcRenderer.send(header, args);
  }
}
