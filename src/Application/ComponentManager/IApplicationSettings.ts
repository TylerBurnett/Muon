import * as yup from 'yup';
import { statSync } from 'fs';

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
  componentsFolderPath: yup
    .string()
    .test('Valid UUID', 'UUID is not a valid format', (value) => {
      try {
        const stats = statSync(value || '');
        return stats.isDirectory();
      } catch (e) {
        return false;
      }
    }),
});

/**
 * Builder for the IApplicationsSettings Interface
 */
export const Defaults = {
  componentNodeAccessWhitelist: [] as string[],
  componentsFolderPath: './yeet',
} as IApplicationSettings;
