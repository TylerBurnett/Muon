import * as yup from 'yup';
import { validate } from 'uuid';
import { IVec2 } from '../Common/IVec2';

/**
 * Extends the pre-exsisting IComponentSettings
 * This is used to keep track of component config file locations
 */
export interface IComponentSettingsMeta extends IComponentSettings {
  configPath: string;
}

/**
 * Custom component base settings (Things that should always be the same no matter the component)
 */
export interface IComponentSettings {
  uuid: string;
  name: string;
  active: boolean;
  production: boolean;
  nodeDependency: boolean;
  iconData?: string;
  iconPath?: string;

  displayFile: string;
  componentPath: string;

  windowLocation: IVec2;
  windowSize: IVec2;

  settings: IUserSetting[];
}

/**
 * Interface validator
 */
export const ComponentSettingsValidator = yup.object({
  uuid: yup
    .string()
    .required('UUID Requires a value')
    .test('Valid UUID', 'UUID is not a valid format', (value) =>
      validate(value || '')
    ),
  name: yup.string().required('Component Name Requires a value'),
  active: yup.boolean().required('Active Requires a value'),
  production: yup.boolean().required('Production Requires a value'),
  nodeDependency: yup.boolean().required('Node Dependency Requires a value'),
  displayFile: yup.string().required('Display File Requires a value'),
  componentPath: yup.string().required('Component Path Requires a value'),
});

/**
 * User facing settings exposed for editing,
 * this will later be used in the main application
 * to edit the component functionality, Like in rainmeter.
 */
export interface IUserSetting {
  name: string;
  description: string;
  variable: unknown;
}
