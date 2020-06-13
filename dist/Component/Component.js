"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentBase = void 0;
const fs_1 = require("fs");
const electron_1 = require("electron");
/**
 * Component Base class, used as extended class for all custom components
 */
class ComponentBase {
    constructor() {
        // Load Config -> notify manager of result.
        if (this.loadConfig()) {
        }
        else {
            this.deconstruct(false);
        }
    }
    // Object and window deconstruction, Deconstruction is handled by object for time being in the event of major errors.
    deconstruct(saveState, error) {
        if (saveState) {
            if (this.settings != null && this.settings != undefined) {
                this.saveConfig();
            }
        }
        // Message Parent about shutting down
        if (error) {
        }
        else {
        }
        // Close the component
        const window = electron_1.remote.getCurrentWindow();
        window.close();
    }
    // Loads the component config from respective directory
    loadConfig() {
        try {
            if (fs_1.existsSync('config.json')) {
                fs_1.readFile("config.json", function (err, buf) {
                    this.settings = JSON.parse(buf.toString());
                    return true;
                });
            }
            else {
                fs_1.writeFile("config.json", JSON.stringify(this.settings), (err) => {
                    if (err)
                        return false;
                    else
                        return true;
                });
            }
        }
        catch (err) {
        }
        return false;
    }
    // Saves the component config from the respective directory
    saveConfig() {
        fs_1.writeFile("config.json", JSON.stringify(this.settings), (err) => {
            if (err)
                return false;
            else
                return true;
        });
        return false;
    }
}
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=Component.js.map