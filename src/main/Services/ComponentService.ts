import { Component, ComponentConfig } from '../Data/ComponentConfig';

export default interface ComponentService {
  getComponentConfigs(): ComponentConfig[];

  getComponentConfig(
    idValue: unknown,
    matchType?: 'uuid' | 'webContentsId'
  ): ComponentConfig | undefined;

  getComponent(
    idValue: unknown,
    matchType: 'uuid' | 'webContentsId'
  ): Component | undefined;

  updateComponentConfig(newState: ComponentConfig): void;

  checkComponentStatus(uuid: string): void;
}
