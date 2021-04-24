//require("v8-compile-cache");
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");
import { ComponentManager } from "./ComponentManager/ComponentManager";
import { TrayManager } from "./System/TrayManager";
import { app, Tray } from "electron";

app.on("window-all-closed", function (e: Event) {
  e.preventDefault();
});

// Import debugging tools.
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: any) => console.log(`Added Extension:  ${name}`))
    .catch((err: any) => console.log("An error occurred: ", err));

  // Now lets start the app.
  var componentManager = new ComponentManager();

  // Add an icon to the tray.
  TrayManager.addTrayIcon();
});
