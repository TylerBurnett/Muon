"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentManager = void 0;
var electron_1 = require("electron");
var path_1 = require("path");
var fs_1 = require("fs");
var IApplicationSettings_1 = require("./IApplicationSettings");
var Messenger_1 = require("../Messenger/Messenger");
/**
 * Component manager class
 *  this class is purposed for use in the application which maintains and runs the custom components.
 */
var ComponentManager = /** @class */ (function () {
    function ComponentManager() {
        // Attach the parent messenger to the manager
        this.messenger = new Messenger_1.ManagerMessenger();
        if (fs_1.existsSync("settings.json")) {
            this.settings = this.loadSettings();
        }
        else {
            this.settings = new IApplicationSettings_1.Defaults();
            var result = this.saveSettings();
        }
        // Call display loop on components
        var components = this.findComponents();
        // Instantiate all components.
        components.forEach(function (component) {
            console.log(component);
            var win = new electron_1.BrowserWindow({
                width: component.windowSize.x,
                height: component.windowSize.y,
                webPreferences: {
                    nodeIntegration: true,
                },
                frame: false,
                transparent: true,
            });
            var displayPath = "file://" +
                __dirname +
                "/../../Components/" +
                component.componentPath +
                "/" +
                component.displayFile;
            win.loadURL(displayPath);
            win.webContents.on("dom-ready", function () {
                win.webContents.send(Messenger_1.ComponentRecievers.Config, JSON.stringify(component));
            });
        });
    }
    Object.defineProperty(ComponentManager.prototype, "components", {
        get: function () {
            return this.findComponents();
        },
        enumerable: false,
        configurable: true
    });
    ComponentManager.prototype.loadSettings = function () {
        var contents = fs_1.readFileSync("settings.json");
        return JSON.parse(contents.toString());
    };
    ComponentManager.prototype.saveSettings = function () {
        if (fs_1.existsSync("settings.json")) {
            fs_1.writeFileSync("settings.json", JSON.stringify(this.settings));
        }
        return false;
    };
    ComponentManager.prototype.findComponents = function () {
        // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
        var dirs = fs_1.readdirSync("Components").filter(function (f) {
            return fs_1.statSync(path_1.join("Components", f)).isDirectory();
        });
        var components = [];
        var baseDir = "Components/";
        for (var dir in dirs) {
            var path = baseDir + dirs[dir] + "/config.json";
            if (fs_1.existsSync(path)) {
                var contents = JSON.parse(fs_1.readFileSync(path).toString());
                components.push(contents);
            }
        }
        return components;
    };
    return ComponentManager;
}());
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=ComponentManager.js.map