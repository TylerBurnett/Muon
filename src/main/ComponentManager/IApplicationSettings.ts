import * as yup from 'yup';

/**
 * The Interface for users application settings
 */
export interface IApplicationSettings {
  componentNodeAccessWhitelist: string[];
  componentSettings: IComponentInstanceSettings[];
  componentsFolderPath: string;
}

/**
 * Manages settings that are handled on an instance basis, E.G. Should not be controlled
 * externally by the component dev.
 */
export interface IComponentInstanceSettings {
  uuid: string;
  active: boolean;
  nodeAccess: boolean;
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
  };
};

/**
 * Builder for the IApplicationsSettings Interface
 */
export const ApplicationSettingsDefaults = {
  componentNodeAccessWhitelist: [] as string[],
  componentSettings: [] as object[],
  componentsFolderPath: '/components',
} as IApplicationSettings;
