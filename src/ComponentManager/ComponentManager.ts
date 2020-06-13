import { BrowserWindow } from "electron";
import { join } from "path";
import { readFile, writeFile, existsSync, appendFile, readdirSync, statSync, readFileSync } from "fs";
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
            this.settings = new Defaults;
            const result = this.saveSettings();
        }

        // Call display loop on components
        var components = this.findComponents();

        console.log(components);
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
        // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
        var dirs = readdirSync("Components").filter(f => statSync(join("Components", f)).isDirectory());
        let components: IComponentSettings[] = [];

        const baseDir = "Components/";
        for (const dir in dirs) {
            var path = baseDir + dirs[dir] + "/config.json";
            if (existsSync(path)) {
                var contents = JSON.parse(readFileSync(path).toString());
                components.push(<IComponentSettings>contents);
            }
        }

        return components;
    }
}