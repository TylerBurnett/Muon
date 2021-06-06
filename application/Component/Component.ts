import { IComponentSettings } from "./IComponentSettings";
import { ComponentMessenger } from "./ComponentMessenger";

/**
 * Component Base class, used as extended class for all custom components
 */
export class ComponentBase {
  settings: IComponentSettings;
  messenger: ComponentMessenger;

  constructor() {
    // Set the callback for the config reciever
    this.messenger = new ComponentMessenger(this.setConfig.bind(this));

    this.insertWindowArgs();
    // Continue past super into component code.
  }

  //Call back for the settings
  private setConfig(config: IComponentSettings) {
    this.settings = config;
  }

  private insertWindowArgs() {
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = this.styleRules;
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  private styleRules: string = `body {
    -webkit-app-region: drag; 
    -webkit-user-select: none;
  }`;
}
