import { container, Lifecycle } from 'tsyringe';
import IPC_GetComponentConfig from './API/IPCGetComponentConfig';
import IPC_GetComponentConfigs from './API/IPCGetComponentConfigs';
import IPCGetSettings from './API/IPCGetSettings';
import IPCLogError from './API/IPCLogError';
import IPCLogInfo from './API/IPCLogInfo';
import IPCLogWarning from './API/IPCLogWarning';
import IPCSetComponentConfig from './API/IPCSetComponentConfig';
import IPCSetComponentSettings from './API/IPCSetComponentSettings';
import IPCSetSettings from './API/IPCSetSettings';
import ApplicationSettingsService from './Services/ApplicationSettingsService';
import ApplicationSettingsServiceImpl from './Services/ApplicationSettingsServiceImpl';
import ClientService from './Services/ClientService';
import ClientServiceImpl from './Services/ClientServiceImpl';
import ComponentService from './Services/ComponentService';
import ComponentServiceImpl from './Services/ComponentServiceImpl';
import LoggerService from './Services/LoggerService';
import LoggerServiceImpl from './Services/LoggerServiceImpl';
import SystemTrayService from './Services/SystemTrayService';
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

  container.register<SystemTrayService>(
    'SystemTrayService',
    {
      useClass: SystemTrayServiceImpl,
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

  // IPC Endpoints
  container.resolve(IPC_GetComponentConfig);

  container.resolve(IPC_GetComponentConfigs);

  container.resolve(IPCGetSettings);

  container.resolve(IPCLogError);

  container.resolve(IPCLogInfo);

  container.resolve(IPCLogWarning);

  container.resolve(IPCSetComponentConfig);

  container.resolve(IPCSetComponentSettings);

  container.resolve(IPCSetSettings);

  return container;
};

export default buildContainer;
