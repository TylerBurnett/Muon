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
        // Template object for the window settings
        this.debugSettings = {
            webPreferences: {
                nodeIntegration: true,
            },
        };
        // Template object for the window settings
        this.productionSettings = {
            webPreferences: {
                nodeIntegration: true,
                devTools: false,
            },
            frame: false,
            transparent: true,
        };
        // Attach the parent messenger to the manager
        this.messenger = new Messenger_1.ManagerMessenger();
        if (fs_1.existsSync("settings.json")) {
            this.settings = this.loadSettings();
        }
        else {
            this.settings = new IApplicationSettings_1.Defaults();
            this.saveSettings();
        }
        // Finally, load the components.
        this.loadComponents();
    }
    Object.defineProperty(ComponentManager.prototype, "components", {
        get: function () {
            return this.findComponents();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Loads the collective of located components
     */
    ComponentManager.prototype.loadComponents = function () {
        var _this = this;
        this.components.forEach(function (component) {
            _this.loadComponent(component);
        });
    };
    /**
     * Loads an individual component based on the provided settings
     * @param component The component settings
     */
    ComponentManager.prototype.loadComponent = function (component) {
        // Determine the template object for the window settings
        var windowSettings = component.production
            ? this.productionSettings
            : this.debugSettings;
        // Slap the dynamic values in
        var window = new electron_1.BrowserWindow(Object.assign({}, windowSettings, {
            width: component.windowSize.x,
            height: component.windowSize.y,
        }));
        // Build the display path
        var displayPath = "file://" +
            __dirname +
            "/../../Components/" +
            component.componentPath +
            "/" +
            component.displayFile;
        // Load its display file
        window.loadURL(displayPath);
        // Set its position
        window.setPosition(component.windowLocation.x, component.windowLocation.y);
        // Wait until its ready before sending it the settings.
        window.webContents.on("dom-ready", function () {
            window.webContents.send(Messenger_1.ComponentRecievers.Config, component);
        });
    };
    /**
     * Loads the application settings
     */
    ComponentManager.prototype.loadSettings = function () {
        var contents = fs_1.readFileSync("settings.json");
        return JSON.parse(contents.toString());
    };
    /**
     * Saves the application settings
     */
    ComponentManager.prototype.saveSettings = function () {
        if (fs_1.existsSync("settings.json")) {
            fs_1.writeFileSync("settings.json", JSON.stringify(this.settings));
        }
        return false;
    };
    /**
     * Finds all the components in the /Components directory
     */
    ComponentManager.prototype.findComponents = function () {
        // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
        var directories = fs_1.readdirSync("Components").filter(function (f) {
            return fs_1.statSync(path_1.join("Components", f)).isDirectory();
        });
        var components = [];
        var baseDir = "Components/";
        for (var directory in directories) {
            var path = baseDir + directories[directory] + "/config.json";
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