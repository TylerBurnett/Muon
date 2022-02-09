import { ipcRenderer } from 'electron';
import { ManagerRecievers } from '../../../main/Common/Recievers';
import { SettingsContainer } from '../../../main/Data/ApplicationSettings';

export function getSettings() {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.GetSettings, {})
      // eslint-disable-next-line promise/always-return
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setSettings(state: SettingsContainer) {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.SetSettings, [state])
      // eslint-disable-next-line promise/always-return
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setComponentNodeAccess(uuid: string, newState: boolean) {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.SetComponentNodeAccess, [uuid, newState])
      // eslint-disable-next-line promise/always-return
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setComponentActiveState(uuid: string, newState: boolean) {
  return new Promise<{ data: SettingsContainer }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.SetComponentActiveState, [uuid, newState])
      // eslint-disable-next-line promise/always-return
      .then((response: SettingsContainer) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}
