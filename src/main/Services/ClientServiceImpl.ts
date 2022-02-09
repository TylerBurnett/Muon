import { BrowserWindow } from 'electron';
import {
  interfaceDebugSettings,
  interfaceProductionSettings,
} from '../Data/WindowSettings';
import { resolveHtmlPath } from '../Common/util';
import ClientService from './ClientService';

export default class ClientServiceImpl implements ClientService {
  private readonly windowSettings =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
      ? interfaceDebugSettings
      : interfaceProductionSettings;

  private clientIntance: BrowserWindow | undefined;

  constructor() {
    this.clientIntance = undefined;
  }

  /**
   * Starts the client interface, if an instance exsists it will maximise the current instance instead.
   */
  public startApp(): void {
    if (this.clientIntance === undefined)
      this.clientIntance = this.buildWindow();
    else this.clientIntance.maximize();
  }

  public getId(): number | undefined {
    if (this.clientIntance !== undefined) {
      return this.clientIntance.webContents.id;
    }
    return undefined;
  }

  private buildWindow() {
    // Slap the dynamic values in
    const window = new BrowserWindow(this.windowSettings);

    // Remove instance when user closes client
    window.on('closed', () => {
      this.clientIntance = undefined;
    });

    // Load its display file
    window.loadURL(resolveHtmlPath('index.html'));

    // Maximize the window
    window.maximize();

    return window;
  }
}
