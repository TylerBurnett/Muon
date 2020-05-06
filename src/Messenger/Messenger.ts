import { ipcMain, ipcRenderer } from "electron";

export class ManagerMessenger {

    constructor() {
        // Hook as the primary component
        ipcMain.on('asynchronous-message', (event, args) => {
            this.handleMessage(event, args);
        });

    }

    public sendMessage() {
        //ipcMain.emit()
    }

    private handleMessage(event: Electron.IpcMainEvent, args: any[]) {
        try {
            const header = <ManagerRecievers>args[0]
            const component = <string>args[1];

            switch (header) {

                // Logging Headers
                case ManagerRecievers.Error:
                    console.log("ERROR in:  " + component + ", " + <string>args[2])
                    break;

                case ManagerRecievers.Warning:
                    console.log("WARNING in:  " + component + ", " + <string>args[2])
                    break;

                case ManagerRecievers.Log:
                    console.log(component + ": " + <string>args[2])
                    break;

                // Event Headers
                // TBA
            }

        }
        catch {
            console.log("ERROR: Cannot parse component header.");
        }
    }
}

/**
 * This class is both the listener and sender of events to the Component Manager
 * This class should be private in the BaseComponent Class, public functions should be encapsulated in a wrapper 
 * in the BaseComponent class.
 */
export class ComponentMessenger {

    // Responding function when the Manager requests deconstruction of the object.
    private onDeconstruct: Function;

    // Responding function when the manager requests the component to reload.
    private onReload: Function;

    constructor(deconstructor: Function, reloader: Function) {

        // Set responders
        this.onDeconstruct = deconstructor;
        this.onReload = reloader;

        // Hook component as a renderer
        ipcRenderer.on('asynchronous-message', (event, args) => {
            this.handleMessage(event, args);
        });
    }

    public sendMessage(header: ComponentRecievers, sender: string, message?: string) {
        const args = [header, sender, message || ""];

        ipcRenderer.send('asynchronous-message', args);
    }

    private handleMessage(event: Electron.IpcRendererEvent, args: any[]) {

        event.type
        try {
            const header = <ComponentRecievers>args[0]

            switch (header) {

                case ComponentRecievers.Reload:
                    this.onReload;
                    break;

                case ComponentRecievers.Close:
                    this.onDeconstruct;
                    break;
            }

        }
        catch {
            console.log("ERROR: Cannot parse component header.");
        }

    }

}

/**
 * This enumerator is used for specifying the intent of a message to a component
 * This should be used in the case of: ComponentManager --> Component Messaging.
 * Note: A component will only react to these headers.
 */
export enum ComponentRecievers {
    Reload,
    Close,
}

/**
 * This enumerator is used for specifying the intent of a message to the Component Manager
 * This should be used in the case of: Component --> ComponentManager Messaging.
 * Note: The component manager will only react to these headers.
 */
export enum ManagerRecievers {
    Error,
    Warning,
    Log,
}

