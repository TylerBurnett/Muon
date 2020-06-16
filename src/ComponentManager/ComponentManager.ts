import { BrowserWindow, app } from "electron";
import { join } from "path";
import {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { IApplicationSettings, Defaults } from "./IApplicationSettings";
import { IComponentSettings } from "../Component/IComponentSettings";
import { ManagerMessenger, ComponentRecievers } from "../Messenger/Messenger";

/**
 * Component manager class
 *  this class is purposed for use in the application which maintains and runs the custom components.
 */
export class ComponentManager {
  settings: IApplicationSettings;
  activeComponents: BrowserWindow[];
  messenger: ManagerMessenger;

  get components() {
    return this.findComponents();
  }

  constructor() {
    // Attach the parent messenger to the manager
    this.messenger = new ManagerMessenger();

    if (existsSync("settings.json")) {
      this.settings = this.loadSettings();
    } else {
      this.settings = new Defaults();
      const result = this.saveSettings();
    }

    // Call display loop on components
    var components = this.findComponents();
    // Instantiate all components.
    components.forEach((component) => {
      console.log(component);
      const win = new BrowserWindow({
        width: component.windowSize.x,
        height: component.windowSize.y,
        webPreferences: {
          nodeIntegration: true,
        },
        frame: false,
        transparent: true,
      });
      var displayPath =
        "file://" +
        __dirname +
        "/../../Components/" +
        component.componentPath +
        "/" +
        component.displayFile;
      win.loadURL(displayPath);

      win.webContents.on("dom-ready", () => {
        win.webContents.send(
          ComponentRecievers.Config,
          JSON.stringify(component)
        );
      });
    });
  }

  private loadSettings(): IApplicationSettings {
    var contents = readFileSync("settings.json");
    return <IApplicationSettings>JSON.parse(contents.toString());
  }

  private saveSettings(): boolean {
    if (existsSync("settings.json")) {
      writeFileSync("settings.json", JSON.stringify(this.settings));
    }

    return false;
  }

  private findComponents(): IComponentSettings[] {
    // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
    var dirs = readdirSync("Components").filter((f) =>
      statSync(join("Components", f)).isDirectory()
    );
    let components: IComponentSettings[] = [];

    const baseDir = "Components/";
    for (const dir in dirs) {
      var path = baseDir + dirs[dir] + "/config.json";
      if (existsSync(path)) {
        var contents = JSON.parse(readFileSync(path).toString());
        components.push(<IComponentSettings>contents);
      }
    }

    return components;
  }
}
