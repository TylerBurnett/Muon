import { IComponentSettings } from "./IComponentSettings";
import { ComponentMessenger } from "../Messenger/Messenger";

/**
 * Component Base class, used as extended class for all custom components
 */
export class ComponentBase {
  settings: IComponentSettings;
  messenger: ComponentMessenger;

  constructor() {
    // Set the callback for the config reciever
    this.messenger = new ComponentMessenger(this.setConfig.bind(this));
    // Continue past super into component code.
  }

  //Call back for the settings
  private setConfig(config: IComponentSettings) {
    this.settings = config;
    console.log(this.settings);
  }
}
