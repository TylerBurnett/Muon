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

/**
 * Component manager class
 * This class is purposed for use in the application which maintains and runs the custom components
 */
@singleton()
export default class ComponentServiceImpl implements ComponentService {
  components: Component[];

  constructor(
    @inject('Logger') private logger: Logger,
    @inject('ApplicationSettingsService')
    private appSettings: ApplicationSettingsService
  ) {
    this.components = this.loadComponentConfigs();

    app
      .whenReady()
      .then(() =>
        this.components.map((component) => {
          component.window = this.buildWindow(component);
          return component;
        })
      )
      .catch(logger.log);
  }

  public getComponentConfigs() {
    return this.components.map((comp) => comp.settings);
  }

  public getComponentConfig(uuid: string) {
    return this.getComponent(uuid)?.settings;
  }

  public updateComponentConfig(newState: ComponentConfig) {
    let currentState: Component | undefined;

    this.components.map((obj) => {
      if (obj.settings.uuid === newState.uuid) {
        obj.settings = newState;
        currentState = obj;
      }
      return obj;
    });

    if (currentState) this.saveComponentConfig(currentState);
  }

  public checkComponentStatus(uuid: string) {
    const component = this.getComponent(uuid);
    if (component) {
      const componentSettings = this.appSettings.getComponentSettings(
        component.settings.uuid
      );
      if (componentSettings) {
        const shouldActivate = this.shouldActivate(
          component.settings,
          componentSettings
        );

        if (shouldActivate && component.window === undefined)
          this.stopComponent(component.settings.uuid);
        else if (!shouldActivate && component.window)
          this.startComponent(component.settings.uuid);
      }
    }
  }

  private getComponent(uuid: string) {
    return this.components.find((obj) => obj.settings.uuid === uuid);
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
      if (obj.settings.uuid === uuid && obj.window === undefined)
        obj.window = this.buildWindow(obj);
      return obj;
    });
  }

  private stopComponent(uuid: string) {
    this.components = this.components.map((obj) => {
      if (obj.settings.uuid === uuid && obj.window !== undefined) {
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
    const windowSettings = component.settings.production
      ? componentProductionSettings
      : componentDebugSettings;

    // Slap the dynamic values in
    const componentWindow = new BrowserWindow({
      ...windowSettings,
      width: component.settings.windowSize.x,
      height: component.settings.windowSize.y,
      x: component.settings.windowLocation.x,
      y: component.settings.windowLocation.y,

      webPreferences: {
        ...windowSettings.webPreferences,
        nodeIntegration: component.settings.nodeDependency,
      },
    });

    // Build the display path based on external or system components.
    const displayPath = `file://${component.componentDir}/${component.settings.displayFile}`;

    // Load its display file
    componentWindow.loadURL(displayPath);

    componentWindow.on('moved', () => {
      const componentIndex = this.components.findIndex(
        (comp) => comp.settings.uuid === component.settings.uuid
      );

      const [x, y] = componentWindow.getPosition();

      this.updateComponentConfig({
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
            settings: contents,
            configPath: componentDirPath,
            componentDir: `${baseDir}/${directory}`,
            window: undefined,
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
   * Saves a component config back to the origin file.
   * @param newState
   */
  private async saveComponentConfig(newState: Component) {
    writeFileSync(
      `${newState.componentDir}/config.json`,
      JSON.stringify(newState.settings)
    );
  }
}
