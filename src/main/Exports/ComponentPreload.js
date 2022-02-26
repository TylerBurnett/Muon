const { contextBridge, ipcRenderer } = require('electron');
const OS = require('os-utils');

ipcRenderer.on('EnableDrag', () => {
  const style = document.createElement('style');
  style.id = 'component-drag';
  style.type = 'text/css';
  style.innerHTML = `body {
      -webkit-app-region: drag; 
      -webkit-user-select: none;
    }`;
  document.getElementsByTagName('head')[0].appendChild(style);
});

ipcRenderer.on('DisableDrag', () => {
  document.getElementById('component-drag')?.remove();
});

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.id = 'component-drag';
  style.type = 'text/css';
  style.innerHTML = `body {
    -webkit-app-region: drag; 
    -webkit-user-select: none;
  }`;
  document.getElementsByTagName('head')[0].appendChild(style);
});

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.invoke('ShowContextMenu');
});

contextBridge.exposeInMainWorld('Component', {
  getSettings: () => ipcRenderer.invoke('GetComponent', []),

  logInfo: (message) =>
    ipcRenderer.invoke('LogInfo', ['ComponentName', message]),

  logWarning: (message) =>
    ipcRenderer.invoke('LogWarning', ['ComponentName', message]),

  logError: (message) =>
    ipcRenderer.invoke('LogError', ['ComponentName', message]),
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
