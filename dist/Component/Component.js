"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentBase = void 0;
var Messenger_1 = require("../Messenger/Messenger");
/**
 * Component Base class, used as extended class for all custom components
 */
var ComponentBase = /** @class */ (function () {
    function ComponentBase() {
        // Set the callback for the config reciever
        this.messenger = new Messenger_1.ComponentMessenger(this.setConfig.bind(this));
        // Continue past super into component code.
    }
    ComponentBase.prototype.setConfig = function (config) {
        this.settings = config;
        console.log(this.settings);
    };
    return ComponentBase;
}());
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=Component.js.map