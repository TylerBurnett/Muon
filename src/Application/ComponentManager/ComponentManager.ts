import { BrowserWindow } from 'electron';
import path from 'path';
import {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { ValidationError } from 'yup';
import { Logger } from 'winston';
import {
  componentDebugSettings,
  componentProductionSettings,
  interfaceDebugSettings,
  interfaceProductionSettings,
} from './WindowSettings';
// eslint-disable-next-line import/no-cycle
import ManagerMessenger from './ManagerMessenger';
import { ComponentRecievers } from '../Common/Recievers';
import { IApplicationSettings, Defaults } from './IApplicationSettings';
import {
  IComponentSettings,
  IComponentSettingsMeta,
  ComponentSettingsValidator,
} from '../Common/IComponentSettings';
import buildLogger from './Logger';

/**
 * Component manager class
 * This class is purposed for use in the application which maintains and runs the custom components
 */
export default class ComponentManager {
  settings: IApplicationSettings;

  messenger: ManagerMessenger;

  logger: Logger;

  components: {
    settings: IComponentSettingsMeta;
    window: BrowserWindow | null;
  }[];

  static instance: ComponentManager;

  constructor() {
    // Attach the parent messenger to the manager
    this.messenger = new ManagerMessenger();
    this.logger = buildLogger();

    // Load settings
    this.settings = {} as IApplicationSettings;
    if (!this.loadInternalSettings()) {
      this.settings = Defaults;
      this.saveInternalSettings();
    }

    // Finally, load the components.
    this.components = this.findComponents().map((componentSettings) => {
      return {
        settings: componentSettings,
        window: this.startComponent(componentSettings),
      };
    });

    // Now set the static instance to this.
    ComponentManager.instance = this;
  }

  /**
   * Loads an individual component based on the provided settings
   * @param component The component settings
   * @param system Is this a system component? Affect pathing
   */
  public startComponent(
    component: IComponentSettingsMeta
  ): BrowserWindow | null {
    if (
      this.settings.componentNodeAccess ||
      component.nodeDependency === false
    ) {
      if (component.active) {
        const windowSettings = component.production
          ? componentProductionSettings
          : componentDebugSettings;

        // Slap the dynamic values in
        const componentWindow = new BrowserWindow({
          ...windowSettings,
          width: component.windowSize.x,
          height: component.windowSize.y,
          x: component.windowLocation.x,
          y: component.windowLocation.y,

          webPreferences: {
            ...windowSettings.webPreferences,
            nodeIntegration: component.nodeDependency,
          },
        });

        // Build the display path based on external or system components.
        const displayPath = `file://${__dirname}/Components/${component.componentPath}/${component.displayFile}`;

        // Load its display file
        componentWindow.loadURL(displayPath);

        // Wait until its ready before sending it the settings.
        componentWindow.webContents.on('dom-ready', () => {
          componentWindow.webContents.send(
            ComponentRecievers.Config,
            component
          );
        });

        // Add it to the list of initialised components.
        return componentWindow;
      }
    } else {
      this.logger.info(
        `Component ${component.name} has node depedencies but lacks node access, to fix this change Component Node Access in settings.`
      );
      return null;
    }

    return null;
  }

  /**
   * Loads an individual component based on the provided settings
   * @param component The component settings
   * @param system Is this a system component? Affect pathing
   */
  public static startApp(): void {
    const windowSettings =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? interfaceDebugSettings
        : interfaceProductionSettings;

    // Slap the dynamic values in
    const window = new BrowserWindow(windowSettings);

    // Build the display path based on external or system components.
    const displayPath = `file://${__dirname}/../../index.html`;

    // Maximize the window
    window.maximize();

    // Load its display file
    window.loadURL(displayPath);
  }

  /**
   * Loads the application settings
   * @returns The sucessfullness of returning the settings
   */
  private loadInternalSettings(): boolean {
    if (existsSync(`${__dirname}/settings.json`)) {
      const contents = readFileSync(`${__dirname}/settings.json`);

      this.settings = <IApplicationSettings>JSON.parse(contents.toString());
      return true;
    }
    return false;
  }

  /**
   * Saves the application settings
   */
  private saveInternalSettings(): void {
    writeFileSync(`${__dirname}/settings.json`, JSON.stringify(this.settings));
  }

  /**
   * Saves the specific component settings (also does dirty component work when required)
   * @param newState The component settings passed back by the system.
   * @returns
   */
  public updateComponentSettings(newState: IComponentSettingsMeta): boolean {
    try {
      // Write the file first to see if it breaks
      writeFileSync(
        newState.configPath,
        JSON.stringify(<IComponentSettings>newState)
      );

      const componentIndex = this.components.findIndex(
        (component) => component.settings.uuid === newState.uuid
      );

      if (newState.active) {
        if (!this.components[componentIndex].settings.active) {
          this.components[componentIndex].window?.close();
        }
      } else if (this.components[componentIndex].settings.active)
        this.components[componentIndex].window = this.startComponent(newState);
      this.components[componentIndex].settings = newState;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Finds all the components in the /Components directory
   */
  private findComponents(): IComponentSettingsMeta[] {
    // This code works, but lacks error checking. Add some logs that provide context to why a component couldnt load
    const directories = readdirSync(`${__dirname}/Components`).filter((f) =>
      statSync(path.join(`${__dirname}/Components`, f)).isDirectory()
    );

    const components: IComponentSettingsMeta[] = [];
    const baseDir = path.join(__dirname, '/Components');

    directories.forEach((directory) => {
      const componentConfigPath = `${baseDir}/${directory}/config.json`;

      if (existsSync(componentConfigPath)) {
        const contents: IComponentSettings = JSON.parse(
          readFileSync(componentConfigPath).toString()
        );
        try {
          ComponentSettingsValidator.validateSync(contents);

          components.push(<IComponentSettingsMeta>{
            ...contents,
            configPath: componentConfigPath,
          });
        } catch (e: unknown) {
          this.logger.error((<ValidationError>e).errors.join(','));
        }
      } else {
        this.logger.info(
          `Could not find component config @${directory}, please check the location of this file.`
        );
      }
    });

    return components;
  }

  /**
   * Used the get the static singleton instance of the ComponentManager class
   * @returns The Component Manager Instance
   */
  public static getManager(): ComponentManager {
    return ComponentManager.instance;
  }

  /**
   * Gets the users settings
   * @returns Gets the users settings
   */
  public getSettings(): IApplicationSettings {
    return this.settings;
  }
}
