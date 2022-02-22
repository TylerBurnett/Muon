import * as yup from 'yup';

/**
 * The Interface for users application settings
 */
export interface SettingsContainer {
  componentSettings: ComponentSettings[];
  applicationSettings: ApplicationSettings;
}

/**
 * Manages settings that are handled on an instance basis, E.G. Should not be controlled
 * externally by the component dev.
 */
export interface ComponentSettings {
  uuid: string;
  active: boolean;
  nodeAccess: boolean;
  locked: boolean;
}

export interface ApplicationSettings {
  componentsFolderPath: string;
}

/**
 * Interface validator
 */
export const ApplicationSettingsValidator = yup.object({
  componentNodeAccessWhitelist: yup.array().of(yup.string()),
  componentsFolderPath: yup.string(),
});

/**
 * Defaults for new component settings instances
 */
export const ComponentInstanceSettingsDefaults = (uuid: string) => {
  return {
    uuid,
    active: false,
    nodeAccess: false,
    locked: false,
  };
};

/**
 * Builder for the IApplicationsSettings Interface
 */
export const ApplicationSettingsDefaults = {
  componentSettings: [] as object[],
  applicationSettings: {
    componentsFolderPath: './components',
  },
} as SettingsContainer;
