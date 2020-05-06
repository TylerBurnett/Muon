import { IVec2 } from "../IVec2";

// Custom component base settings (Things that should always be the same not matter the component)
export interface IComponentSettings {
    name: string;
    active: boolean;
    displayFile: string;
    windowLocation: IVec2;
    windowsSize: IVec2;
    settings: IUserSetting[];
}

// User facing settings exposed for editing, 
// this will later be used in the main application 
// to edit the component functionality, Like in rainmeter.
export interface IUserSetting {
    name: string;
    description: string;
    variable: any;
}