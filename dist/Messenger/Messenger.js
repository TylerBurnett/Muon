"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
/**
 * This class is both the listener and sender of events to Components
 * This class should be used in the Component Manager only
 */
class ManagerMessenger {
    constructor() {
        // Create a reciever for errors
        electron_1.ipcMain.on(ManagerRecievers.Error, (event, args) => {
            console.log("ERROR in:  " + args[0] + ", " + args[1]);
        });
        // Create a reciever for warnings
        electron_1.ipcMain.on(ManagerRecievers.Warning, (event, args) => {
            console.log("WARNING in:  " + args[0] + ", " + args[1]);
        });
        // Create a reciever for logging
        electron_1.ipcMain.on(ManagerRecievers.Log, (event, args) => {
            console.log(args[0] + ": " + args[1]);
        });
    }
    sendMessage(window, reciever) {
        window.webContents.send(reciever, null);
    }
}
exports.ManagerMessenger = ManagerMessenger;
exports.default = ManagerMessenger;
/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper
 * in the BaseComponent class.
 */
class ComponentMessenger {
    /**
     * Intakes event responders for the Component class. This class should only be used in ComponentBase.
     * @param deconstructor The component deconstructor should be used here. Will be called upon recieving request from ComponentManager.
     * @param reloader The component Reloader should be used here. Will be called upon recieving request from ComponentManager.
     */
    constructor(onConfig) {
        // Create a config reciever
        electron_1.ipcRenderer.on(ComponentRecievers.Config, (event, args) => {
            this.onConfig(args);
        });
    }
    /**
     * This function should be wrapped by a ComponentBase Function to ensure correct component name passing.
     * @param header The enum header that specifies the intent of the message
     * @param sender The caller component name.
     * @param message Additonal information, Used primarily when using Log, Warning, Error.
     */
    sendMessage(header, sender, message) {
        const args = [sender, message];
        electron_1.ipcRenderer.send(header, args);
    }
}
exports.ComponentMessenger = ComponentMessenger;
/**
 * This enumerator is used for specifying the intent of a message to a component
 * This should be used in the case of: ComponentManager --> Component Messaging.
 * Note: A component will only react to these headers.
 */
var ComponentRecievers;
(function (ComponentRecievers) {
    ComponentRecievers["Config"] = "Config";
})(ComponentRecievers = exports.ComponentRecievers || (exports.ComponentRecievers = {}));
/**
 * This enumerator is used for specifying the intent of a message to the Component Manager
 * This should be used in the case of: Component --> ComponentManager Messaging.
 * Note: The component manager will only react to these headers.
 */
var ManagerRecievers;
(function (ManagerRecievers) {
    ManagerRecievers["Error"] = "Error";
    ManagerRecievers["Warning"] = "Warning";
    ManagerRecievers["Log"] = "Log";
})(ManagerRecievers = exports.ManagerRecievers || (exports.ManagerRecievers = {}));
//# sourceMappingURL=Messenger.js.map