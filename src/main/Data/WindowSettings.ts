import path from 'path';

/**
 * The system interface window settings
 */
export const interfaceProductionSettings = {
  webPreferences: {
    devTools: false,
    // TODO These will totally break when we build the app, find a better way to resolve path based on prod/ packaged flags
    preload: path.join(__dirname, '../Exports/ClientPreload.js'),
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
    // TODO These will totally break when we build the app, find a better way to resolve path based on prod/ packaged flags
    preload: path.join(__dirname, '../Exports/ClientPreload.js'),
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
    preload: path.join(__dirname, '../Exports/ComponentPreload.js'),
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
    preload: path.join(__dirname, '../Exports/ComponentPreload.js'),
  },
  hasShadow: false,
  type: 'desktop',
  skipTaskbar: true,
};
