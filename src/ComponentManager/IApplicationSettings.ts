// This will be used for application level settings
export interface IApplicationSettings {
  componentNodeAccess: boolean;
}

export class Defaults implements IApplicationSettings {
  componentNodeAccess: false;
}
