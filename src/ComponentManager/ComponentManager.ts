import { BrowserWindow } from "electron";
import { readFile, writeFile } from "fs";
import { IApplicationSettings } from "./IApplicationSettings";
import { IComponentSettings } from "../Component/IComponentSettings";

/**
 * Component manager class
 *  this class is purposed for use in the application which maintains and runs the custom components.
 */
export class ComponentManager {

    settings: IApplicationSettings;
    activeComponents: BrowserWindow[];

    get components() {
        return this.findComponents();
    }

    constructor() {
        // Load application settings
        if (!this.loadSettings())
            // Continue constructing
            console.log("ComponentManager: Constructor failed, Unable to load settings.");
    }

    private loadSettings(): boolean {
        readFile("settings.json", function (err, buf) {
            this.settings = <IApplicationSettings>JSON.parse(buf.toString());
            return true;
        });

        return false;
    }

    private saveSettings(): boolean {
        writeFile("settings.json", JSON.stringify(this.settings), (err) => {
            if (err) return false;
            else return true;
        });

        return false;
    }

    private findComponents(): IComponentSettings[] {
        // check all folders in the /components directory
        // Check for config.json
        // Read component settings.

        return null;
    }
}