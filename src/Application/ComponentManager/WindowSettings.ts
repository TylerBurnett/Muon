import path from 'path';

/**
 * The production window settings used for Components
 */
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

/**
 * The Debug window settings used for Components
 */
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

/**
 * Unused, TBD on removal
 */
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
