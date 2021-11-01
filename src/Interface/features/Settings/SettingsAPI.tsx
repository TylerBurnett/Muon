import { ipcRenderer } from 'electron';
import { ManagerRecievers } from '../../../Application/Common/Recievers';
import { IApplicationSettings } from '../../../Application/ComponentManager/IApplicationSettings';

export function getSettings() {
  return new Promise<{ data: IApplicationSettings }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.GetSettings, {})
      // eslint-disable-next-line promise/always-return
      .then((response: IApplicationSettings) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function setSettings(state: IApplicationSettings) {
  return new Promise<{ data: IApplicationSettings }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.SetSettings, [state])
      // eslint-disable-next-line promise/always-return
      .then((response: IApplicationSettings) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}
