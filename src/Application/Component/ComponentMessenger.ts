import { ComponentRecievers, ManagerRecievers } from '../Common/Recievers';
import { IComponentSettings } from '../Common/IComponentSettings';

const { ipcRenderer } = require('electron');

/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper
 * in the BaseComponent class.
 */
export default class ComponentMessenger {
  /**
   * Intakes event responders for the Component class. This class should only be used in ComponentBase.
   */
  constructor(onConfig: (args: IComponentSettings) => void) {
    // Create a config reciever
    ipcRenderer.on(ComponentRecievers.Config, (event: any, args: any) => {
      onConfig(<IComponentSettings>args);
    });
  }

  /**
   * This function should be wrapped by a ComponentBase Function to ensure correct component name passing.
   * @param header The enum header that specifies the intent of the message
   * @param sender The caller component name.
   * @param message Additonal information, Used primarily when using Log, Warning, Error.
   */
  public static sendMessage(
    header: ManagerRecievers,
    sender: string,
    message?: string
  ) {
    const args = [sender, message];
    ipcRenderer.send(header, args);
  }
}
