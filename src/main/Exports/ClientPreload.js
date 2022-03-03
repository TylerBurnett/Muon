const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('client', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, args),
});
