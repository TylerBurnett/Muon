import { ipcRenderer } from 'electron';
import { IComponentSettingsMeta } from '../../../Application/Component/IComponentSettings';
import { ManagerRecievers } from '../../../Application/Common/Recievers';

export function getComponents() {
  return new Promise<{ data: IComponentSettingsMeta[] }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.GetComponents, {})
      // eslint-disable-next-line promise/always-return
      .then((response: IComponentSettingsMeta[]) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

export function getComponent(id: string) {
  return new Promise<{ data: IComponentSettingsMeta }>((resolve) =>
    setTimeout(() => resolve({ data: {} as IComponentSettingsMeta }), 500)
  );
}

export function saveComponent(state: IComponentSettingsMeta) {
  return new Promise<{ data: IComponentSettingsMeta }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.SetComponent, [state])
      // eslint-disable-next-line promise/always-return
      .then((response: boolean) => resolve({ data: state }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}
