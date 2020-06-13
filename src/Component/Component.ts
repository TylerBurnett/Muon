import { existsSync, writeFile, readFile } from "fs";
import { ipcRenderer, remote } from "electron";
import { IComponentSettings } from "./IComponentSettings";
import { ComponentMessenger } from "src/Messenger/Messenger";

/**
 * Component Base class, used as extended class for all custom components
 */
export class ComponentBase {
  settings: IComponentSettings;
  messenger: ComponentMessenger;

  constructor() {
    this.messenger = ComponentMessenger(this.setConfig);

    while (this.settings == undefined) {}
  }

  private setConfig(config: IComponentSettings) {
    this.settings = config;
  }
}
