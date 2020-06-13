import { existsSync, writeFile, readFile } from 'fs';
import { ipcRenderer, remote } from "electron";
import { IComponentSettings } from './IComponentSettings';

/**
 * Component Base class, used as extended class for all custom components
 */
export class ComponentBase {
    settings: IComponentSettings;

    constructor(config:IComponentSettings) {
        this.settings = config;
    }

    // Object and window deconstruction, Deconstruction is handled by object for time being in the event of major errors.
    public deconstruct(saveState: boolean, error?: string) {

        // TODO Rework to do all this through the component manager.

        /*if (saveState) {
            if (this.settings != null && this.settings != undefined) {
                this.saveConfig();
            }
        }

        // Message Parent about shutting down
        if (error) {
        }
        else {
        }*/

        // Close the component
        const window = remote.getCurrentWindow();
        window.close();
    }
}