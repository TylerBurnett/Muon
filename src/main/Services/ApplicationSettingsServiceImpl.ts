import { existsSync, readFileSync, writeFileSync } from 'fs';
import { inject, singleton } from 'tsyringe';
import { ValidationError } from 'yup';
import { Logger } from 'winston';
import ApplicationSettingsService from './ApplicationSettingsService';
import {
  ApplicationSettingsValidator,
  SettingsContainer,
  ComponentSettings,
  ApplicationSettings,
  ApplicationSettingsDefaults,
} from '../Data/ApplicationSettings';
import LoggerService from './LoggerService';

@singleton()
export default class ApplicationSettingsServiceImpl
  implements ApplicationSettingsService
{
  private readonly settingsPath = `${__dirname}/settings.json`;

  private settings: SettingsContainer;

  private log: Logger;

  constructor(@inject('LoggerService') logger: LoggerService) {
    this.log = logger.logger;
    this.settings = {} as SettingsContainer;

    if (!this.loadSettings()) {
      this.settings = ApplicationSettingsDefaults;
      this.saveSettings();
    }
  }

  public getSettingsContainer() {
    return this.settings;
  }

  public getApplicationSettings() {
    return this.settings.applicationSettings;
  }

  public updateApplicationSettings(newState: ApplicationSettings) {
    this.settings.applicationSettings = newState;
    this.saveSettings();
  }

  public getComponentSettings(uuid: string, instantiate = true) {
    const settings = this.settings.componentSettings.find(
      (obj) => obj.uuid === uuid
    );

    if (settings || !instantiate) return settings;

    const index =
      this.settings.componentSettings.push({
        uuid,
        active: false,
        nodeAccess: false,
        locked: false,
      }) - 1;
    this.saveSettings();
    return this.settings.componentSettings[index];
  }

  public updateComponentSettings(newState: ComponentSettings) {
    let oldState: ComponentSettings | undefined;

    this.settings.componentSettings = this.settings.componentSettings.map(
      (obj) => {
        if (obj.uuid === newState.uuid) {
          oldState = obj;
          return newState;
        }
        return obj;
      }
    );

    if (oldState) this.saveSettings();

    return (
      oldState?.active !== newState.active ||
      oldState?.nodeAccess !== newState.nodeAccess
    );
  }

  private loadSettings() {
    if (existsSync(this.settingsPath)) {
      try {
        const contents = readFileSync(this.settingsPath).toString();
        ApplicationSettingsValidator.validateSync(contents);
        this.settings = <SettingsContainer>JSON.parse(contents);

        return true;
      } catch (e: unknown) {
        if ((<ValidationError>e).errors) {
          this.log.error(
            'Failed to load settings file, failed validation',
            (<ValidationError>e).errors.join(',')
          );
        } else {
          this.log.error('Failed to load settings file.');
        }

        return false;
      }
    }
    return false;
  }

  private async saveSettings() {
    writeFileSync(this.settingsPath, JSON.stringify(this.settings));
  }
}
