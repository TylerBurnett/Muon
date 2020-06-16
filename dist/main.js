"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentManager_1 = require("./ComponentManager/ComponentManager");
var _a = require('electron-devtools-installer'), installExtension = _a.default, REACT_DEVELOPER_TOOLS = _a.REACT_DEVELOPER_TOOLS;
var electron_1 = require("electron");
// Import debugging tools.
electron_1.app.whenReady().then(function () {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then(function (name) { return console.log("Added Extension:  " + name); })
        .catch(function (err) { return console.log('An error occurred: ', err); });
    // Now lets start the app
    var componentManager = new ComponentManager_1.ComponentManager();
});
//# sourceMappingURL=main.js.map