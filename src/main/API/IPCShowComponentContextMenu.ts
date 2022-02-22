import { IpcMainInvokeEvent, Menu } from 'electron';
import { inject, singleton } from 'tsyringe';
import ApplicationSettingsService from '../Services/ApplicationSettingsService';
import LoggerService from '../Services/LoggerService';
import ClientService from '../Services/ClientService';
import ComponentService from '../Services/ComponentService';
import IPCHandler from './IPCHandler';

@singleton()
export default class IPCSetComponentConfig extends IPCHandler {
  constructor(
    @inject('LoggerService') logger: LoggerService,
    @inject('ClientService') client: ClientService,
    @inject('ComponentService')
    private components: ComponentService,
    @inject('ApplicationSettingsService')
    private settings: ApplicationSettingsService
  ) {
    super('ShowContextMenu', false, logger.logger, client);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEvent(event: IpcMainInvokeEvent, _args: unknown) {
    const component = this.components.getComponent(
      event.sender.id,
      'webContentsId'
    );

    if (component) {
      const componentSettings = this.settings.getComponentSettings(
        component?.config.uuid
      );
      if (componentSettings) {
        const template = [
          {
            label: componentSettings?.locked
              ? 'Unlock Component Position'
              : 'Lock Component Position',
            click: () => {
              this.settings.updateComponentSettings({
                ...componentSettings,
                locked: !componentSettings?.locked,
              });
              event.sender.send(
                componentSettings.locked ? 'DisableDrag' : 'EnableDrag'
              );
            },
          },
          {
            label: 'Stop Component',
            click: () => {
              this.settings.updateComponentSettings({
                ...componentSettings,
                active: !componentSettings.active,
              });
              this.components.checkComponentStatus(componentSettings.uuid);
            },
          },
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: component.window });
      }
    }
  }
}
