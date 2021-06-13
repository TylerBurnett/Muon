// This will be used for application level settings.
export interface IApplicationSettings {
  componentNodeAccess: boolean;

  editMode: boolean;
}

export const Defaults = {
  componentNodeAccess: false,
  editMode: true,
} as IApplicationSettings;
