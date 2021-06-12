import path from 'path';

// Template object for the window settings
export const debugSettings = {
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    preload: path.join(__dirname, '../Component/preload.js'),
  },
  hasShadow: false,
  type: 'desktop',
  skipTaskbar: true,
};

// Template object for the edit mode settings.
export const productionSettings = {
  webPreferences: {
    devTools: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    preload: path.join(__dirname, '../Component/preload.js'),
  },
  frame: false,
  transparent: true,
  hasShadow: false,
  type: 'desktop',
  skipTaskbar: true,
};

// Template object for the window settings
export const editSettings = {
  webPreferences: {
    devTools: false,
  },
  frame: true,
  transparent: false,
  hasShadow: true,
  type: 'desktop',
  skipTaskbar: false,
};
