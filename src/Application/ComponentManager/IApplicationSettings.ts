/**
 * The Interface for users application settings
 */
export interface IApplicationSettings {
  componentNodeAccess: boolean;

  editMode: boolean;
}

/**
 * Builder for the IApplicationsSettings Interface
 */
export const Defaults = {
  componentNodeAccess: false,
  editMode: true,
} as IApplicationSettings;
