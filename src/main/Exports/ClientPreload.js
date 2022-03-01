const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('client', {
  ipcRenderer,
});
