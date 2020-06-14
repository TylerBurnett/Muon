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

    while (this.settings == undefined) {
      // Cheap but effective. This should be fixed to be less intensive.
    }

    // Continue past super into component code.
  }

  private setConfig(config: IComponentSettings) {
    this.settings = config;
  }
}
