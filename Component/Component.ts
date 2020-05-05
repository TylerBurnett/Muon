import { existsSync, writeFile, readFile } from 'fs';
import { ipcRenderer, remote } from "electron";
import { MessageHeader } from './MessageHeader';

/**
 * Component Base class, used as extended class for all custom components
 * 
 */
class ComponentBase {
    settings: IComponentSettings;


    constructor() {

        // Load Config -> notify manager of result.
        if (this.loadConfig()) {
            this.sendMessage(MessageHeader.Log, "Component " + this.settings.name + "- Loaded and operational.");
        }
        else {
            this.deconstruct(false);
        }
    }

    // Object and window deconstruction, Deconstruction is handled by object for time being in the event of major errors.
    public deconstruct(saveState: boolean, error?: string) {

        if (saveState) {
            if (this.settings != null && this.settings != undefined) {
                this.saveConfig();
            }
        }

        // Message Parent about shutting down
        if (error) {
            this.sendMessage(MessageHeader.Error, "Component " + this.settings.name + "- " + error);
        }
        else {
            this.sendMessage(MessageHeader.Log, "Component " + this.settings.name + "- Shutting down normally.");
        }

        // Close the component
        const window = remote.getCurrentWindow();
        window.close();
    }

    // Messaging service for child components to master component
    public sendMessage(header: MessageHeader, message: string) {
        ipcRenderer.send('asynchronous-message', header + ':' + message);
    }

    // Loads the component config from respective directory
    private loadConfig(): boolean {

        try {
            if (existsSync('config.json')) {

                readFile("config.json", function (err, buf) {
                    this.settings = <IComponentSettings>JSON.parse(buf.toString());
                    return true;
                });
            }
            else {
                writeFile("config.json", JSON.stringify(this.settings), (err) => {
                    if (err) return false;
                    else return true;
                });
            }
        }
        catch (err) {
            this.sendMessage(MessageHeader.Error, err);
        }

        return false;
    }

    // Saves the component config from the respective directory
    private saveConfig(): boolean {
        writeFile("config.json", JSON.stringify(this.settings), (err) => {
            if (err) return false;
            else return true;
        });

        return false;
    }
}