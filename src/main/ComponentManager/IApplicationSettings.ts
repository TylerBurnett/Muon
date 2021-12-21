import * as yup from 'yup';

/**
 * The Interface for users application settings
 */
export interface IApplicationSettings {
  componentNodeAccessWhitelist: string[];
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
 * Builder for the IApplicationsSettings Interface
 */
export const Defaults = {
  componentNodeAccessWhitelist: [] as string[],
  componentsFolderPath: './yeet',
} as IApplicationSettings;
