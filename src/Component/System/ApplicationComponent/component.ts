// Hack alert. JS requires here, as this needs to compile to a raw JS loader, not a module.
const { readFileSync } = require("original-fs");
const component = require(__dirname + "/../../Component.js");
const { ManagerRecievers } = require(__dirname + "/../../../Messenger/Messenger.js")

window.addEventListener("DOMContentLoaded", (event) => {
  var myComponent = new ApplicationSettingsComponent();
});

class ApplicationSettingsComponent extends component.ComponentBase {

  settingForm: HTMLElement;
  // Hack to allow Raw JS indexing of string on Object. This will always be Object.
  appSettings: any;

  constructor() {
    super();
    this.settingForm = document.getElementById('settings');
    this.appSettings = this.loadsettings();
    this.mainLoop();
  }

  mainLoop() {
    // Iterate through and construct controls.
    for (const [key, value] of Object.entries(this.appSettings)) {
      if (typeof value === 'boolean') {
        this.boolSetting(key, value);
      }
    }
  }

  loadsettings(): object {
    return JSON.parse(readFileSync(__dirname + '/../../../../local/settings.json'));
  }

  boolSetting(id: string, value: boolean): void {
    // Parent node.
    let boolNode = document.createElement('label');
    boolNode.setAttribute('class', 'switch');

    // Checkbox.
    let inputNode = document.createElement('input');
    inputNode.setAttribute('type', 'checkbox');
    inputNode.setAttribute('id', id);
    if (value) {
      inputNode.setAttribute('checked', '');
    }
    inputNode.addEventListener('change', this.boolStateChange.bind(this));

    // Label Node.
    let pNode = document.createElement('p');
    pNode.innerHTML = id;
    pNode.setAttribute('class', 'settinglabel');

    // Slider span.
    let switchNode = document.createElement('span');
    switchNode.setAttribute('class', 'slider round');

    boolNode.appendChild(inputNode)
    boolNode.appendChild(switchNode);

    // Add the slider and label to a flexbox.
    let flexbox = document.createElement('div');
    flexbox.setAttribute('class', 'settingcontainer');
    flexbox.appendChild(pNode);
    flexbox.appendChild(boolNode);

    this.settingForm.appendChild(flexbox);
  }

  boolStateChange(event: Event) {
    let target = <HTMLInputElement>event.target;
    let name = target.getAttribute('id');
    this.appSettings[name] = target.checked;

    // Now send the current state of the settings back up to the component manager.
    this.updateSettings();
  }

  updateSettings() {
    this.messenger.sendMessage(
      ManagerRecievers.AppConfig,
      this.settings.name,
      JSON.stringify(this.appSettings)
    );
  }
}
