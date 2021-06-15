import { IComponentSettings } from './IComponentSettings';
import ComponentMessenger from './ComponentMessenger';

/**
 * Component Base class, used as extended class for all custom components
 */
(window as any).ComponentBase = class ComponentBase {
  settings: IComponentSettings;

  messenger: ComponentMessenger;

  constructor() {
    this.settings = {} as IComponentSettings;
    // Set the callback for the config reciever
    this.messenger = new ComponentMessenger(this.setConfig.bind(this));

    // Inject the CSS required to make the component 'draggable'
    this.injectWindowCSS();
  }

  // Call back for the settings
  private setConfig(config: IComponentSettings) {
    this.settings = config;
  }

  /**
   * Injects the required CSS to make the component 'draggable'
   */
  private injectWindowCSS() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = this.style;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  /**
   * The style rules used the make the component 'draggable', see injectWindowCSS()
   */
  private style = `body {
    -webkit-app-region: drag; 
    -webkit-user-select: none;
  }`;
};
