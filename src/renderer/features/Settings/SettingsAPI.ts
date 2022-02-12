import { ipcRenderer } from 'electron';
import {
  ComponentSettings,
  SettingsContainer,
} from '../../../main/Data/ApplicationSettings';

export function getSettings() {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke('GetSettings')
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setSettings(state: SettingsContainer) {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke('SetSettings', [state])
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setComponentSettings(newState: ComponentSettings) {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke('SetComponentSettings', [newState])
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}
