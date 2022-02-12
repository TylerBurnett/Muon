import { ComponentConfig } from '../Data/ComponentConfig';

export default interface ComponentService {
  getComponentConfigs(): ComponentConfig[];

  getComponentConfig(uuid: string): ComponentConfig | undefined;

  updateComponentConfig(newState: ComponentConfig): void;

  checkComponentStatus(uuid: string): void;
}
