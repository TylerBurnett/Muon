import { BrowserWindow, ipcMain, IpcMainInvokeEvent, screen } from 'electron';
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
  Defaults,
} from './IApplicationSettings';
import buildLogger from './Logger';
import {
  ComponentSettingsValidator,
  IComponentSettings,
  IComponentSettingsMeta,
} from '../Component/IComponentSettings';
import { IIPCEvent } from './Types';
import { IVec2 } from '../Common/IVec2';

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
      response: (event: IpcMainInvokeEvent, args: unknown[]) => {
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
      channel: ManagerRecievers.SetComponent,
      response: (event, args: unknown[]) =>
        this.updateComponentSettings(<IComponentSettingsMeta>args[0]),
    },
    {
      channel: ManagerRecievers.Error,
      response: (event, args: unknown[]) => {
        this.logger.error(`ERROR in:  ${<string>args[0]}, ${<string>args[1]}`);
        return true;
      },
    },
    {
      channel: ManagerRecievers.Warning,
      response: (event, args: unknown[]) => {
        this.logger.warn(`ERROR in:  ${<string>args[0]}, ${<string>args[1]}`);
        return true;
      },
    },
    {
      channel: ManagerRecievers.Log,
      response: (event, args: unknown[]) => {
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
          this.components[componentIndex].window =
            this.startComponent(newState);
        }
      } else if (this.components[componentIndex].settings.active)
        this.components[componentIndex].window?.close();
      this.components[componentIndex].settings = newState;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Updates the components node access on runtime
   * @param uuid The component uuid.
   * @param newState the boolean of the new state
   */
  public updateComponentNodeAccess(uuid: string, newState: boolean): boolean {
    const currentStateIndex =
      this.settings.componentNodeAccessWhitelist.findIndex(
        (i: string) => i === uuid
      );

    if (newState) {
      if (currentStateIndex === -1) {
        this.settings.componentNodeAccessWhitelist = [
          ...this.settings.componentNodeAccessWhitelist,
          uuid,
        ];
        return true;
      }
      this.logger.warn(
        'User attempted to add node access to a component despite it already exsisting.'
      );
      return false;
    }

    if (currentStateIndex === -1) {
      this.logger.warn(
        'User attempted to remove node access to a component despite it not exsisting.'
      );
      return false;
    }
    this.settings.componentNodeAccessWhitelist.filter(
      (i: string) => i !== uuid
    );
    return true;
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
      this.settings.componentNodeAccessWhitelist.find(
        (uuid: string) => component.uuid === uuid
      ) ||
      !component.nodeDependency
    ) {
      if (component.active) {
        const windowSettings = component.production
          ? componentProductionSettings
          : componentDebugSettings;

        // Slap the dynamic values in
        const componentWindow = new BrowserWindow({
          ...windowSettings,
          width: <number>component.windowSize.x,
          height: <number>component.windowSize.y,
          x: <number>component.windowLocation.x,
          y: <number>component.windowLocation.y,

          webPreferences: {
            ...windowSettings.webPreferences,
            nodeIntegration: component.nodeDependency,
          },
        });

        // Build the display path based on external or system components.
        const displayPath = `file://${__dirname}/Components/${component.componentPath}/${component.displayFile}`;

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

  // #region Helpers

  private static getRelativePos(
    x: number | string,
    y: number | string,
    screenId?: number
  ): IVec2 {
    const safeX = typeof x === 'number' ? x : Number(x.trimEnd());
    const safeY = typeof y === 'number' ? y : Number(y.trimEnd());

    const screenContext = screenId
      ? screen.getAllDisplays()[screenId]
      : screen.getPrimaryDisplay();

    return {
      x: Math.round(screenContext.bounds.x * (safeX / 100)),
      y: Math.round(screenContext.bounds.y * (safeY / 100)),
    };
  }

  private static getScreenPoint(
    x: number,
    y: number,
    screenId?: number
  ): IVec2 {
    const screenContext = screenId
      ? screen.getAllDisplays()[screenId]
      : screen.getPrimaryDisplay();

    return {
      x: `${Math.round((x / screenContext.bounds.x) * 100)}%`,
      y: `${Math.round((y / screenContext.bounds.y) * 100)}%`,
    };
  }

  // //#endregion Helpers
}
