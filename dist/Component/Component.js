"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messenger_1 = require("src/Messenger/Messenger");
/**
 * Component Base class, used as extended class for all custom components
 */
class ComponentBase {
    constructor() {
        this.messenger = Messenger_1.ComponentMessenger(this.setConfig);
        while (this.settings == undefined) { }
    }
    setConfig(config) {
        this.settings = config;
    }
}
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=Component.js.map