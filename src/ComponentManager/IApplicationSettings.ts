// This will be used for application level settings
export interface IApplicationSettings {
  componentNodeAccess: boolean;
  editMode: boolean;
}

export class Defaults implements IApplicationSettings {
  componentNodeAccess: false;
  editMode: true;
}
