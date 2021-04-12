const { readdirSync, readFileSync } = require("original-fs");
const component = require(__dirname + "/../../Component.js");

window.addEventListener("DOMContentLoaded", (event) => {
  var myComponent = new MyComponent();
});

class MyComponent extends component.ComponentBase {
  constructor() {
    super();
    this.settingForm = document.getElementById('settings');
    this.mainLoop();
  }

  mainLoop() {
    // Load the settings JSON from the local config.
    const settings = this.loadsettings();

    console.log(settings);

    // Iterate through and construct controls.
    for (const [key, value] of Object.entries(settings)) {
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
}
