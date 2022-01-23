import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
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
import { ManagerRecievers } from '../Common/Recievers';
import {
  IApplicationSettings,
  ApplicationSettingsValidator,
  ApplicationSettingsDefaults,
  ComponentInstanceSettingsDefaults,
} from './IApplicationSettings';
import buildLogger from './Logger';
import {
  ComponentSettingsValidator,
  IComponentSettings,
  IComponentSettingsMeta,
} from '../Component/IComponentSettings';
import { IIPCEvent } from './Types';
import { resolveHtmlPath } from './utils';

/**
 * Component manager class
 * This class is purposed for use in the application which maintains and runs the custom components
 */
export default class ComponentManager {
  settings: IApplicationSettings;

  logger: Logger;

  components: {
    settings: IComponentSettingsMeta;
    window: BrowserWindow | null;
  }[];

  private readonly ipcEvents: IIPCEvent[] = [
    {
      channel: ManagerRecievers.GetSettings,
      response: () => {
        return this.settings;
      },
    },
    {
      channel: ManagerRecievers.SetSettings,
      response: (_: IpcMainInvokeEvent, args: unknown[]) => {
        this.settings = args[0] as IApplicationSettings;
        this.saveInternalSettings();
        return this.settings;
      },
    },
    {
      channel: ManagerRecievers.GetComponents,
      response: () => {
        return this.components.map((comp) => comp.settings);
      },
    },
    {
      channel: ManagerRecievers.GetComponent,
      response: (event: IpcMainInvokeEvent, args: unknown[]) => {
        if (args[0]) {
          return this.components.filter(
            (component) => component.settings.uuid === args[0]
          )[0].settings;
        }
        return this.components.filter(
          (component) => component.window?.id === event.sender.id
        )[0].settings;
      },
    },
    {
      channel: ManagerRecievers.SetComponentNodeAccess,
      response: (_: IpcMainInvokeEvent, args: unknown[]) => {
        this.updateComponentNodeAccess(args[0] as string, args[1] as boolean);
        return this.settings;
      },
    },
    {
      channel: ManagerRecievers.SetComponentActiveState,
      response: (_: IpcMainInvokeEvent, args: unknown[]) => {
        this.updateComponentActiveState(args[0] as string, args[1] as boolean);
        return this.settings;
      },
    },
    {
      channel: ManagerRecievers.SetComponent,
      response: (_, args: unknown[]) =>
        this.updateComponentSettings(<IComponentSettingsMeta>args[0]),
    },
    {
      channel: ManagerRecievers.Error,
      response: (_, args: unknown[]) => {
        this.logger.error(`ERROR in:  ${<string>args[0]}, ${<string>args[1]}`);
        return true;
      },
    },
    {
      channel: ManagerRecievers.Warning,
      response: (_, args: unknown[]) => {
        this.logger.warn(`ERROR in:  ${<string>args[0]}, ${<string>args[1]}`);
        return true;
      },
    },
    {
      channel: ManagerRecievers.Log,
      response: (_, args: unknown[]) => {
        this.logger.info(`INFO from:  ${<string>args[0]}, ${<string>args[1]}`);
        return true;
      },
    },
  ];

  constructor() {
    // Attach the parent messenger to the manager
    this.logger = buildLogger();

    // Build the API for the manager
    this.ipcEvents.forEach((event) =>
      ipcMain.handle(event.channel, event.response)
    );

    // Load settings
    this.settings = {} as IApplicationSettings;
    if (!this.loadInternalSettings()) {
      this.settings = ApplicationSettingsDefaults;
      this.saveInternalSettings();
    }

    // Finally, load the components.
    this.components = this.findComponents().map((componentSettings) => {
      return {
        settings: componentSettings,
        window: this.startComponent(componentSettings),
      };
    });
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

    // Build the display path
    // const displayPath = `file://${__dirname}/../../index.html`;

    // Maximize the window
    window.maximize();

    // Load its display file
    window.loadURL(resolveHtmlPath('index.html'));
  }

  // #region Settings Functionality
  /**
   * Gets the users settings
   * @returns Gets the users settings
   */
  public getSettings(): IApplicationSettings {
    return this.settings;
  }

  /**
   * Loads the application settings
   * @returns The sucessfullness of returning the settings
   */
  private loadInternalSettings(): boolean {
    if (existsSync(`${__dirname}/settings.json`)) {
      try {
        const contents = readFileSync(`${__dirname}/settings.json`).toString();
        ApplicationSettingsValidator.validateSync(contents);
        this.settings = <IApplicationSettings>JSON.parse(contents);

        return true;
      } catch (e: unknown) {
        if ((<ValidationError>e).errors) {
          this.logger.error(
            'Failed to load settings file, failed validation',
            (<ValidationError>e).errors.join(',')
          );
        } else {
          this.logger.error('Failed to load settings file.');
        }

        return false;
      }
    }
    return false;
  }

  /**
   * Saves the application settings
   */
  private saveInternalSettings(): void {
    writeFileSync(`${__dirname}/settings.json`, JSON.stringify(this.settings));
  }
  // #endregion Settings Functionality

  // #region Component API
  /**
   * Finds all the components in the /Components directory
   */
  private findComponents(): IComponentSettingsMeta[] {
    const directories = readdirSync(this.settings.componentsFolderPath).filter(
      (f) =>
        statSync(path.join(this.settings.componentsFolderPath, f)).isDirectory()
    );

    const components: IComponentSettingsMeta[] = [];
    const baseDir = path.join(this.settings.componentsFolderPath);

    directories.forEach((directory) => {
      const componentDirPath = `${baseDir}/${directory}`;

      if (existsSync(`${componentDirPath}/config.json`)) {
        const contents: IComponentSettings = JSON.parse(
          readFileSync(`${componentDirPath}/config.json`).toString()
        );

        try {
          ComponentSettingsValidator.validateSync(contents);

          components.push(<IComponentSettingsMeta>{
            ...contents,
            configPath: componentDirPath,
            componentDir: `${baseDir}/${directory}`,
          });

          if (
            this.settings.componentSettings.find(
              (settings) => settings.uuid === contents.uuid
            ) === undefined
          )
            this.settings.componentSettings = [
              ...this.settings.componentSettings,
              ComponentInstanceSettingsDefaults(contents.uuid),
            ];
        } catch (e: unknown) {
          this.logger.error((<ValidationError>e).errors.join(','));
        }
      } else {
        this.logger.info(
          `Could not find component config @${directory}, please check the location of this file.`
        );
      }

      this.saveInternalSettings();
    });

    return components;
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
        `${newState.componentDir}/config.json`,
        JSON.stringify(<IComponentSettings>newState)
      );

      const componentIndex = this.components.findIndex(
        (component) => component.settings.uuid === newState.uuid
      );

      this.components[componentIndex].settings = newState;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Modifies components node access state.
   * @param uuid The component uuid.
   * @param newState the boolean of the new state
   */
  public updateComponentNodeAccess(uuid: string, newState: boolean): void {
    this.settings.componentSettings.map((instance) => {
      if (instance.uuid === uuid) {
        if (newState !== instance.nodeAccess) {
          instance.nodeAccess = newState;
        } else
          this.logger.warn(
            'User attempted to modify a components node access to the same state.'
          );
      }
      return instance;
    });

    this.saveInternalSettings();
  }

  /**
   * Modifies components active state.
   * @param uuid The component uuid.
   * @param newState the boolean of the new state
   */
  public updateComponentActiveState(uuid: string, newState: boolean): void {
    const componentIndex = this.components.findIndex(
      (component) => component.settings.uuid === uuid
    );
    let shouldStart = false;

    this.settings.componentSettings = this.settings.componentSettings.map(
      (instance) => {
        if (instance.uuid === uuid) {
          if (newState !== instance.active) {
            if (newState) {
              shouldStart = true;
            } else {
              this.components[componentIndex].window?.close();
            }

            instance.active = newState;
          } else {
            this.logger.warn(
              'User attempted to modify a components active state to the same state.'
            );
          }
        }
        return instance;
      }
    );

    if (shouldStart)
      this.startComponent(this.components[componentIndex].settings);

    this.saveInternalSettings();
  }

  /**
   * Loads an individual component based on the provided settings
   * @param component The component settings
   * @param system Is this a system component? Affect pathing
   */
  public startComponent(
    component: IComponentSettingsMeta
  ): BrowserWindow | null {
    const instanceSettings = this.settings.componentSettings.find(
      (settings) => settings.uuid === component.uuid
    );

    if (instanceSettings?.nodeAccess || !component.nodeDependency) {
      if (instanceSettings?.active) {
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
        const displayPath = `file://${component.componentDir}/${component.displayFile}`;

        // Load its display file
        componentWindow.loadURL(displayPath);

        componentWindow.on('moved', () => {
          const componentIndex = this.components.findIndex(
            (comp) => comp.settings.uuid === component.uuid
          );

          const [x, y] = componentWindow.getPosition();

          this.updateComponentSettings({
            ...this.components[componentIndex].settings,
            windowLocation: {
              x,
              y,
            },
          });
        });

        // Add it to the list of initialised components.
        return componentWindow;
      }

      this.logger.info(
        `Component ${component.name} is currently inactive, skipping.`
      );
    } else {
      this.logger.info(
        `Component ${component.name} has node depedencies but lacks node access, to fix this change Component Node Access in settings.`
      );
      return null;
    }

    return null;
  }

  // #endregion Component API
}
