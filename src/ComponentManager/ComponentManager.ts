import { BrowserWindow } from "electron";
import { readFile, writeFile, existsSync, appendFile } from "fs";
import { IApplicationSettings, Defaults } from "./IApplicationSettings";
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

        if (existsSync("settings.json")) {
            this.settings = this.loadSettings();
        }
        else {
            console.log("No settings file, creating one now.")
            this.settings = new Defaults;
            const result = this.saveSettings();
            console.log(result)
        }
    }

    private loadSettings(): IApplicationSettings {
        readFile("settings.json", function (err, buf) {
            return <IApplicationSettings>JSON.parse(buf.toString());
        });

        return null;
    }

    private saveSettings(): boolean {

        if (existsSync("settings.json")) {
            writeFile("settings.json", JSON.stringify(this.settings), (err) => {
                if (err) return false;
                else return true;
            });
        }

        else {
            appendFile("settings.json", JSON.stringify(this.settings), (err) => {
                if (err) return false;
                else return true;
            });
        }

        return false;
    }

    private findComponents(): IComponentSettings[] {
        //Assinged to @PeterBurnett 
        // check all folders in the /components directory
        // Check for config.json
        // Read component settings.

        return null;
    }
}