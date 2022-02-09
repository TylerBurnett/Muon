import { existsSync, readFileSync, writeFileSync } from 'fs';
import { inject, singleton } from 'tsyringe';
import { Logger } from 'winston';
import { ValidationError } from 'yup';
import ApplicationSettingsService from './ApplicationSettingsService';
import {
  ApplicationSettingsValidator,
  SettingsContainer,
  ComponentSettings,
  ApplicationSettings,
  ApplicationSettingsDefaults,
} from '../Data/ApplicationSettings';

@singleton()
export default class ApplicationSettingsServiceImpl
  implements ApplicationSettingsService
{
  private readonly settingsPath = `${__dirname}/settings.json`;

  private settings: SettingsContainer;

  constructor(@inject('Logger') private logger: Logger) {
    this.settings = {} as SettingsContainer;

    if (!this.loadSettings()) {
      this.settings = ApplicationSettingsDefaults;
      this.saveSettings();
    }
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

    return this.settings.componentSettings[
      this.settings.componentSettings.push({
        uuid,
        active: false,
        nodeAccess: false,
      }) - 1
    ];
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

  private async saveSettings() {
    writeFileSync(this.settingsPath, JSON.stringify(this.settings));
  }
}
