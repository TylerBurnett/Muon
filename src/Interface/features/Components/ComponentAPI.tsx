import { ipcRenderer } from 'electron';
import { IComponentSettings } from '../../../Application/Component/IComponentSettings';
import { ManagerRecievers } from '../../../Application/Common/Recievers';

// A mock function to mimic making an async request for data
export function getComponents() {
  return new Promise<{ data: IComponentSettings[] }>((resolve) =>
    ipcRenderer
      .invoke(ManagerRecievers.GetComponents, {})
      // eslint-disable-next-line promise/always-return
      .then((response: IComponentSettings[]) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e))
  );
}

// A mock function to mimic making an async request for data
export function getComponent(id: string) {
  return new Promise<{ data: IComponentSettings }>((resolve) =>
    setTimeout(() => resolve({ data: {} as IComponentSettings }), 500)
  );
}

// A mock function to mimic making an async request for data
export function saveComponent(state: IComponentSettings) {
  return new Promise<{ data: IComponentSettings }>((resolve) =>
    setTimeout(() => resolve({ data: state }), 500)
  );
}
