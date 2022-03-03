import { ComponentConfig } from '../../../main/Data/ComponentConfig';

export function getComponents() {
  return new Promise<{ data: ComponentConfig[] }>((resolve) =>
    window.client
      .invoke('GetComponentConfigs', {})
      .then((response: ComponentConfig[]) => resolve({ data: response }))
      // eslint-disable-next-line no-console
      .catch(console.log)
  );
}

export function getComponent() {
  return new Promise<{ data: ComponentConfig }>((resolve) =>
    setTimeout(() => resolve({ data: {} as ComponentConfig }), 500)
  );
}

export function saveComponent(state: ComponentConfig) {
  return new Promise<{ data: ComponentConfig }>((resolve) =>
    window.client
      .invoke('SetComponentConfig', [state])
      .then(() => resolve({ data: state }))
      // eslint-disable-next-line no-console
      .catch(console.log)
  );
}
