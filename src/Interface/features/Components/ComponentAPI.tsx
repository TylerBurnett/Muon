import { IComponentSettings } from '../../../Application/Component/IComponentSettings';

// A mock function to mimic making an async request for data
export function getComponents() {
  return new Promise<{ data: IComponentSettings[] }>((resolve) =>
    setTimeout(() => resolve({ data: [] }), 500)
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
