"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentBase = void 0;
const Messenger_1 = require("../Messenger/Messenger");
/**
 * Component Base class, used as extended class for all custom components
 */
class ComponentBase {
    constructor() {
        // Set the callback for the config reciever
        this.messenger = new Messenger_1.ComponentMessenger(this.setConfig.bind(this));
        while (this.settings == undefined) {
            // Cheap but effective. This should be fixed to be less intensive.
        }
        // Continue past super into component code.
    }
    setConfig(config) {
        this.settings = config;
    }
}
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=Component.js.map