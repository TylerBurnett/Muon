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
  messenger: ManagerMessenger;
  activeComponents: BrowserWindow[];

  // MAGIC STATIC SINGLETON STUFF.
  static instance: ComponentManager;

  get components() {
    return this.findComponents();
  }

  constructor() {
    // Attach the parent messenger to the manager
    this.messenger = new ManagerMessenger();

    if (existsSync("./local/settings.json")) {
      this.settings = this.loadSettings();
    } else {
      this.settings = new Defaults();
      this.saveSettings();
    }

    // Finally, load the components.
    this.activeComponents = [];
    this.loadComponents();

    // Now set the static instance to this.
    ComponentManager.instance = this;
  }

  /**
   * Loads the collective of located components
   */
  public loadComponents() {
    this.components.forEach((component) => {
      this.loadComponent(component, false);
    });
  }

  /**
   * Loads an individual component based on the provided settings
   * @param component The component settings
   * @param system Is this a system component? Affect pathing
   */
  public loadComponent(component: IComponentSettings, system: Boolean): void {
    if (
      this.settings.componentNodeAccess ||
      this.settings.componentNodeAccess == component.nodeDependency
    ) {
      // Determine the template object for the window settings
      let windowSettings;
      if (this.settings.editMode) {
        windowSettings = this.editSettings; 
      } else {
        windowSettings = component.production
        ? this.productionSettings
        : this.debugSettings;
      }

      // Slap the dynamic values in
      let window = new BrowserWindow(
        Object.assign({}, windowSettings, {
          width: component.windowSize.x,
          height: component.windowSize.y,
          x: component.windowLocation.x,
          y: component.windowLocation.y,

          webPreferences: {
            ...windowSettings.webPreferences,
            nodeIntegration: component.nodeDependency,
          },
        })
      );

      // Build the display path based on external or system components.
      let displayPath = '';
      if (!system) {
        displayPath =
        "file://" +
        __dirname +
        "/../Components/" +
        component.componentPath +
        "/" +
        component.displayFile;

      } else {
        displayPath =
        "file://" +
        __dirname +
        "/Component/System/" +
        component.componentPath +
        "/" +
        component.displayFile;
      }
      
      // Load its display file
      window.loadURL(displayPath);

      // Wait until its ready before sending it the settings.
      window.webContents.on("dom-ready", () => {
        window.webContents.send(ComponentRecievers.Config, component);
      });

      // Add it to the list of initialised components.
      this.activeComponents.push(window);

    } else {
      console.error(
        "Component has node depedencies but lacks node access, to fix this change Component Node Access in settings"
      );
    }
  }

  /**
   * Loads the application settings
   */
  private loadSettings(): IApplicationSettings {
    var contents = readFileSync("local/settings.json");
    return <IApplicationSettings>JSON.parse(contents.toString());
  }

  /**
   * Saves the application settings
   */
  private saveSettings(): boolean {
    if (existsSync("local/settings.json")) {
      writeFileSync("local/settings.json", JSON.stringify(this.settings));
    }

    return false;
  }

  /**
   * Finds all the components in the /Components directory
   */
  private findComponents(): IComponentSettings[] {
    // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load.
    var directories = readdirSync("Components").filter((f) =>
      statSync(join("Components", f)).isDirectory()
    );
    let components: IComponentSettings[] = [];

    const baseDir = "Components/";
    for (const directory in directories) {
      const path = baseDir + directories[directory] + "/config.json";
      if (existsSync(path)) {
        const contents = JSON.parse(readFileSync(path).toString());
        components.push(<IComponentSettings>contents);
      }
    }

    return components;
  }

  /**
   * Load the system settings component.
   */
  public loadApplicationComponent(): void {
    const path = __dirname + "/Component/System/ApplicationComponent/config.json";
    const ApplicationSettings = <IComponentSettings>JSON.parse(readFileSync(path).toString());
    this.loadComponent(ApplicationSettings, true);
  }

  // TODO. MOVE THESE TO AN INTERFACE FILE.
  // Template object for the window settings
  private debugSettings = {
    webPreferences: {},
    hasShadow: false,
    type: "desktop",
    skipTaskbar: true,
  };

  // Template object for the edit mode settings.
  private productionSettings = {
    webPreferences: {
      devTools: false,
    },
    frame: false,
    transparent: true,
    hasShadow: false,
    type: "desktop",
    skipTaskbar: true,
  };

  // Template object for the window settings
  private editSettings = {
    webPreferences: {
      devTools: false,
    },
    frame: true,
    transparent: false,
    hasShadow: true,
    type: "desktop",
    skipTaskbar: false,
  };

  /**
   * Public access point for Updating the settings, from tray or from messenger.
   * 
   * @param json The JSON holding the settings.
   * @param update Are we updating the settings, or replacing with new JSON.
   */
  public updateSettings(json: string, update: boolean = false) {
  
    const parsed: IApplicationSettings = JSON.parse(json);
    let temp: any = this.settings;
    if (update) {
      for (const [key, value] of Object.entries(<IApplicationSettings>parsed)) {
        temp[key] = value;
      }

      this.settings = <IApplicationSettings> temp;
    } else {
      this.settings = <IApplicationSettings> JSON.parse(json);
    }

    this.saveSettings();
    this.reload();
  }

  private reload() {
    this.activeComponents.forEach(element => element.close());
    this.activeComponents = [];
    this.loadComponents();
  }
  
  // Singleton MAGIC POWER!
  public static getManager(): ComponentManager {
    return ComponentManager.instance;
  }

  public getSettings(): IApplicationSettings {
    return this.settings;
  }
}
