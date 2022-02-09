import {
  ComponentSettings,
  ApplicationSettings,
} from '../Data/ApplicationSettings';

export default interface ApplicationSettingsService {
  getApplicationSettings(): ApplicationSettings;

  updateApplicationSettings(newState: ApplicationSettings): void;

  getComponentSettings(
    uuid: string,
    instantiate?: boolean
  ): ComponentSettings | undefined;

  updateComponentSettings(newState: ComponentSettings): boolean;
}
