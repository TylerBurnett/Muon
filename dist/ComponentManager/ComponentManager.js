"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const IApplicationSettings_1 = require("./IApplicationSettings");
/**
 * Component manager class
 *  this class is purposed for use in the application which maintains and runs the custom components.
 */
class ComponentManager {
    constructor() {
        if (fs_1.existsSync("settings.json")) {
            this.settings = this.loadSettings();
        }
        else {
            console.log("No settings file, creating one now.");
            this.settings = new IApplicationSettings_1.Defaults;
            const result = this.saveSettings();
            console.log(result);
        }
    }
    get components() {
        return this.findComponents();
    }
    loadSettings() {
        fs_1.readFile("settings.json", function (err, buf) {
            return JSON.parse(buf.toString());
        });
        return null;
    }
    saveSettings() {
        if (fs_1.existsSync("settings.json")) {
            fs_1.writeFile("settings.json", JSON.stringify(this.settings), (err) => {
                if (err)
                    return false;
                else
                    return true;
            });
        }
        else {
            fs_1.appendFile("settings.json", JSON.stringify(this.settings), (err) => {
                if (err)
                    return false;
                else
                    return true;
            });
        }
        return false;
    }
    findComponents() {
        //Assinged to @PeterBurnett 
        // check all folders in the /components directory
        // Check for config.json
        // Read component settings.
        return null;
    }
}
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=ComponentManager.js.map