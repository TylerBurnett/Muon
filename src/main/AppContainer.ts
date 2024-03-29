import { container, Lifecycle } from 'tsyringe';
import IPCGetComponentConfig from './API/IPCGetComponentConfig';
import IPCGetComponentConfigs from './API/IPCGetComponentConfigs';
import IPCGetSettings from './API/IPCGetSettings';
import IPCLogError from './API/IPCLogError';
import IPCLogInfo from './API/IPCLogInfo';
import IPCLogWarning from './API/IPCLogWarning';
import IPCSetComponentConfig from './API/IPCSetComponentConfig';
import IPCSetComponentSettings from './API/IPCSetComponentSettings';
import IPCSetSettings from './API/IPCSetSettings';
import IPCShowComponentContextMenu from './API/IPCShowComponentContextMenu';
import ApplicationSettingsService from './Services/ApplicationSettingsService';
import ApplicationSettingsServiceImpl from './Services/ApplicationSettingsServiceImpl';
import ClientService from './Services/ClientService';
import ClientServiceImpl from './Services/ClientServiceImpl';
import ComponentService from './Services/ComponentService';
import ComponentServiceImpl from './Services/ComponentServiceImpl';
import LoggerService from './Services/LoggerService';
import LoggerServiceImpl from './Services/LoggerServiceImpl';
import SystemTrayServiceImpl from './Services/SystemTrayServiceImpl';

const buildContainer = () => {
  /**
   * Container Registry
   */
  container.register<LoggerService>(
    'LoggerService',
    {
      useClass: LoggerServiceImpl,
    },
    { lifecycle: Lifecycle.Singleton }
  );

  container.register<ApplicationSettingsService>(
    'ApplicationSettingsService',
    {
      useClass: ApplicationSettingsServiceImpl,
    },
    { lifecycle: Lifecycle.Singleton }
  );

  container.register<ClientService>(
    'ClientService',
    {
      useClass: ClientServiceImpl,
    },
    { lifecycle: Lifecycle.Singleton }
  );

  container.register<ComponentService>(
    'ComponentService',
    {
      useClass: ComponentServiceImpl,
    },
    { lifecycle: Lifecycle.Singleton }
  );

  /**
   * Container Resolvers
   */
  container.resolve(SystemTrayServiceImpl);

  // IPC Endpoints
  container.resolve(IPCGetComponentConfig);

  container.resolve(IPCGetComponentConfigs);

  container.resolve(IPCGetSettings);

  container.resolve(IPCLogError);

  container.resolve(IPCLogInfo);

  container.resolve(IPCLogWarning);

  container.resolve(IPCSetComponentConfig);

  container.resolve(IPCSetComponentSettings);

  container.resolve(IPCSetSettings);

  container.resolve(IPCShowComponentContextMenu);

  return container;
};

export default buildContainer;
