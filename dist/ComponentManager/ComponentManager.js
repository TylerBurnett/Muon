"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/**
 * Component manager class
 *  this class is purposed for use in the application which maintains and runs the custom components.
 */
class ComponentManager {
    constructor() {
        // Load application settings
        if (!this.loadSettings())
            // Continue constructing
            console.log("ComponentManager: Constructor failed, Unable to load settings.");
    }
    get components() {
        return this.findComponents();
    }
    loadSettings() {
        fs_1.readFile("settings.json", function (err, buf) {
            this.settings = JSON.parse(buf.toString());
            return true;
        });
        return false;
    }
    saveSettings() {
        fs_1.writeFile("settings.json", JSON.stringify(this.settings), (err) => {
            if (err)
                return false;
            else
                return true;
        });
        return false;
    }
    findComponents() {
        // check all folders in the /components directory
        // Check for config.json
        // Read component settings.
        return null;
    }
}
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=ComponentManager.js.map