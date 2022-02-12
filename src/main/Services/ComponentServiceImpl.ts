import { BrowserWindow, app } from 'electron';
import path from 'path';
import {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { ValidationError } from 'yup';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import {
  componentDebugSettings,
  componentProductionSettings,
} from '../data/WindowSettings';
import {
  ComponentSettingsValidator as ComponentConfigValidator,
  ComponentConfig,
  Component,
} from '../Data/ComponentConfig';
import ApplicationSettingsService from './ApplicationSettingsService';
import ComponentService from './ComponentService';
import { ComponentSettings } from '../Data/ApplicationSettings';
import LoggerService from './LoggerService';

/**
 * Component manager class
 * This class is purposed for use in the application which maintains and runs the custom components
 */
@singleton()
export default class ComponentServiceImpl implements ComponentService {
  private components: Component[];

  private log: Logger;

  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ApplicationSettingsService')
    private appSettings: ApplicationSettingsService
  ) {
    this.log = logger.logger;
    this.components = this.loadComponentConfigs();

    console.log('Component Service Instance');

    app
      .whenReady()
      .then(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const obj of this.components) {
          this.checkComponentStatus(obj.config.uuid);
        }
        return undefined;
      })
      .catch(() =>
        this.log.error('App failed to ready in ComponentServiceImpl')
      );
  }

  public getComponentConfigs() {
    return this.components.map((comp) => comp.config);
  }

  public getComponentConfig(uuid: string) {
    return this.getComponent(uuid)?.config;
  }

  public updateComponentConfig(newState: ComponentConfig) {
    let currentState: Component | undefined;

    this.components.map((obj) => {
      if (obj.config.uuid === newState.uuid) {
        obj.config = newState;
        currentState = obj;
      }
      return obj;
    });

    if (currentState) ComponentServiceImpl.saveComponentConfig(currentState);
  }

  public checkComponentStatus(uuid: string) {
    const component = this.getComponent(uuid);
    if (component) {
      const componentSettings = this.appSettings.getComponentSettings(
        component.config.uuid
      );
      if (componentSettings) {
        const shouldActivate = ComponentServiceImpl.shouldActivate(
          component.config,
          componentSettings
        );

        console.log(shouldActivate);

        if (shouldActivate && component.window === undefined)
          this.startComponent(component.config.uuid);
        else if (!shouldActivate && component.window)
          this.stopComponent(component.config.uuid);
      }
    }
  }

  private getComponent(uuid: string) {
    return this.components.find((obj) => obj.config.uuid === uuid);
  }

  private static shouldActivate(
    component: ComponentConfig,
    settings: ComponentSettings
  ) {
    return (
      settings.active && (settings.nodeAccess || !component.nodeDependency)
    );
  }

  private startComponent(uuid: string) {
    this.components = this.components.map((obj) => {
      if (obj.config.uuid === uuid && obj.window === undefined)
        obj.window = this.buildWindow(obj);
      return obj;
    });
  }

  private stopComponent(uuid: string) {
    this.components = this.components.map((obj) => {
      if (obj.config.uuid === uuid && obj.window !== undefined) {
        obj.window.close();
        obj.window = undefined;
      }

      return obj;
    });
  }

  /**
   * Loads an individual component based on the provided settings
   * @param component The component settings
   */
  private buildWindow(component: Component): BrowserWindow {
    const windowSettings = component.config.production
      ? componentProductionSettings
      : componentDebugSettings;

    // Slap the dynamic values in
    const componentWindow = new BrowserWindow({
      ...windowSettings,
      width: component.config.windowSize.x,
      height: component.config.windowSize.y,
      x: component.config.windowLocation.x,
      y: component.config.windowLocation.y,

      webPreferences: {
        ...windowSettings.webPreferences,
        nodeIntegration: component.config.nodeDependency,
      },
    });

    // Build the display path based on external or system components.
    const displayPath = `file://${component.componentDir}/${component.config.displayFile}`;

    // Load its display file
    componentWindow.loadURL(displayPath);

    componentWindow.on('moved', () => {
      const componentIndex = this.components.findIndex(
        (comp) => comp.config.uuid === component.config.uuid
      );

      const [x, y] = componentWindow.getPosition();

      this.updateComponentConfig({
        ...this.components[componentIndex].config,
        windowLocation: {
          x,
          y,
        },
      });
    });

    // Add it to the list of initialised components.
    return componentWindow;
  }

  /**
   * Using the the config directory provided in appSettings. Searches every folder in the file structure for the relevant configs.
   * @returns A partial component object.
   */
  private loadComponentConfigs(): Component[] {
    const applicationSettings = this.appSettings.getApplicationSettings();

    const directories = readdirSync(
      applicationSettings.componentsFolderPath
    ).filter((f) =>
      statSync(
        path.join(applicationSettings.componentsFolderPath, f)
      ).isDirectory()
    );

    const components: Component[] = [];
    const baseDir = path.join(applicationSettings.componentsFolderPath);

    directories.forEach((directory) => {
      const componentDirPath = `${baseDir}/${directory}`;

      if (existsSync(`${componentDirPath}/config.json`)) {
        const contents: ComponentConfig = JSON.parse(
          readFileSync(`${componentDirPath}/config.json`).toString()
        );

        try {
          ComponentConfigValidator.validateSync(contents);

          components.push({
            config: contents,
            configPath: componentDirPath,
            componentDir: `${baseDir}/${directory}`,
            window: undefined,
          });
        } catch (e: unknown) {
          this.log.error((<ValidationError>e).errors.join(','));
        }
      } else {
        this.log.info(
          `Could not find component config @${directory}, please check the location of this file.`
        );
      }
    });

    return components;
  }

  /**
   * Saves a component config back to the origin file.
   * @param newState
   */
  private static async saveComponentConfig(newState: Component) {
    writeFileSync(
      `${newState.componentDir}/config.json`,
      JSON.stringify(newState.config)
    );
  }
}
