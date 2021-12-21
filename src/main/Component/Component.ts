import { ManagerRecievers } from '../Common/Recievers';

const { contextBridge, ipcRenderer } = require('electron');
const OS = require('os-utils');

window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `body {
    -webkit-app-region: drag; 
    -webkit-user-select: none;
  }`;
  document.getElementsByTagName('head')[0].appendChild(style);
});

contextBridge.exposeInMainWorld('Component', {
  getSettings: () => ipcRenderer.invoke(ManagerRecievers.GetComponent, []),

  logInfo: (message: string) =>
    ipcRenderer.invoke(ManagerRecievers.Log, ['ComponentName', message]),

  logWarning: (message: string) =>
    ipcRenderer.invoke(ManagerRecievers.Warning, ['ComponentName', message]),

  logError: (message: string) =>
    ipcRenderer.invoke(ManagerRecievers.Warning, ['ComponentName', message]),
});

contextBridge.exposeInMainWorld('OS', {
  cpuUsage: OS.cpuUsage,

  cpuFree: OS.cpuFree,

  platform: OS.platform,

  countCPUs: OS.countCPUs,

  freemem: OS.freemem,

  totalmem: OS.totalmem,

  freememPercentage: OS.freememPercentage,

  sysUptime: OS.sysUptime,

  processUptime: OS.processUptime,

  loadavg: OS.loadavg,
});
