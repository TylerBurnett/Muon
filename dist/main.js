"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentManager_1 = require("./ComponentManager/ComponentManager");
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const electron_1 = require("electron");
// Import debugging tools.
electron_1.app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});
// Start the manager
var componentManager = new ComponentManager_1.ComponentManager();
//# sourceMappingURL=main.js.map