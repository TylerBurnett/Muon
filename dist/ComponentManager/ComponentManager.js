"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
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
            this.settings = new IApplicationSettings_1.Defaults;
            const result = this.saveSettings();
        }
        // Call display loop on components
        var components = this.findComponents();
        // Instantiate all components.
        components.forEach(component => {
            console.log(component);
            const win = new electron_1.BrowserWindow({ width: component.windowSize.x, height: component.windowSize.y });
            var displayPath = 'file://' + __dirname + '/../../Components/' + component.componentPath + '/' + component.displayFile;
            win.loadURL(displayPath);
        });
    }
    get components() {
        return this.findComponents();
    }
    loadSettings() {
        var contents = fs_1.readFileSync("settings.json");
        return JSON.parse(contents.toString());
    }
    saveSettings() {
        if (fs_1.existsSync("settings.json")) {
            fs_1.writeFileSync("settings.json", JSON.stringify(this.settings));
        }
        return false;
    }
    findComponents() {
        // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
        var dirs = fs_1.readdirSync("Components").filter(f => fs_1.statSync(path_1.join("Components", f)).isDirectory());
        let components = [];
        const baseDir = "Components/";
        for (const dir in dirs) {
            var path = baseDir + dirs[dir] + "/config.json";
            if (fs_1.existsSync(path)) {
                var contents = JSON.parse(fs_1.readFileSync(path).toString());
                components.push(contents);
            }
        }
        return components;
    }
}
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=ComponentManager.js.map