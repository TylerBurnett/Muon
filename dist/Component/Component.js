"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentBase = void 0;
const electron_1 = require("electron");
/**
 * Component Base class, used as extended class for all custom components
 */
class ComponentBase {
    constructor(config) {
        this.settings = config;
    }
    // Object and window deconstruction, Deconstruction is handled by object for time being in the event of major errors.
    deconstruct(saveState, error) {
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
        const window = electron_1.remote.getCurrentWindow();
        window.close();
    }
}
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=Component.js.map