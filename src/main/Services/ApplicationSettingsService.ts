import {
  ComponentSettings,
  ApplicationSettings,
  SettingsContainer,
} from '../Data/ApplicationSettings';

export default interface ApplicationSettingsService {
  getSettingsContainer(): SettingsContainer;

  getApplicationSettings(): ApplicationSettings;

  updateApplicationSettings(newState: ApplicationSettings): void;

  getComponentSettings(
    uuid: string,
    instantiate?: boolean
  ): ComponentSettings | undefined;

  updateComponentSettings(newState: ComponentSettings): boolean;
}
