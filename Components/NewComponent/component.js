console.log("Here we are");
const os = require("os");
const component = require("../../dist/Component/Component.js");

window.addEventListener("DOMContentLoaded", (event) => {
  var myComponent = new MyComponent();
});

class MyComponent extends component.ComponentBase {
  constructor() {
    super();
    setInterval(this.mainLoop.bind(this), 1000);
  }

  mainLoop() {
    var timeTitle = document.getElementById("TimeTitle");
    var dateTitle = document.getElementById("DateTitle");

    const time = new Date();
    timeTitle.innerHTML =
      time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    dateTitle.innerHTML =
      time.getDay() + " | " + time.getMonth() + " | " + time.getUTCFullYear();
  }
}
