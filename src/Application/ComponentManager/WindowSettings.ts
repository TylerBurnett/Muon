import path from 'path';

/**
 * The system interface window settings
 */
export const interfaceProductionSettings = {
  webPreferences: {
    devTools: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    // TODO Find a way to fix the component API to then re-enable this
    contextIsolation: false,
  },
  type: 'desktop',
  frame: true,
};

/**
 * The system interface window settings
 */
export const interfaceDebugSettings = {
  webPreferences: {
    devTools: true,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    // TODO Find a way to fix the component API to then re-enable this
    contextIsolation: false,
  },
  type: 'desktop',
  frame: true,
};

/**
 * The production window settings used for Components
 */
export const componentProductionSettings = {
  webPreferences: {
    devTools: false,
    preload: path.join(__dirname, '../Component/preload.js'),
    contextIsolation: true,
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
export const componentDebugSettings = {
  webPreferences: {
    preload: path.join(__dirname, '../Component/preload.js'),
    contextIsolation: true,
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
