import * as yup from 'yup';
import { validate } from 'uuid';
import { BrowserWindow } from 'electron';
import { Vec2 } from './Vec2';

/**
 * Interface container for Components
 * Used internally to store metadata and functional classes associated with the operations of a component.
 */
export interface Component {
  configPath: string;
  componentDir: string;
  settings: ComponentConfig;
  window: BrowserWindow | undefined;
}

/**
 * component configuration, In a sense the config can be described as developer centric settings.
 */
export interface ComponentConfig {
  uuid: string;
  name: string;
  description: string;
  authorName: string;
  projectUrl: string;
  active: boolean;
  production: boolean;
  nodeDependency: boolean;
  iconData?: string;
  iconPath?: string;

  displayFile: string;
  componentPath: string;

  windowLocation: Vec2;
  windowSize: Vec2;

  settings: ComponentUserConfig[];
}

/**
 * Used as an object array in ComponentConfig, this gives the component user defined extensibility.
 */
export interface ComponentUserConfig {
  name: string;
  description: string;
  value: unknown;
  validator: string;
}

/**
 * Component Config Validator, used to verify the correct use of data which cant be achieved through type checking.
 */
export const ComponentSettingsValidator = yup.object({
  uuid: yup
    .string()
    .required('UUID Requires a value')
    .test('Valid UUID', 'UUID is not a valid format', (value) =>
      validate(value || '')
    ),
  name: yup.string().required('Component Name Requires a value'),
  description: yup.string().required('Description Requires a value'),
  authorName: yup.string().required('Author Name Requires a value'),
  projectUrl: yup.string().url(),
  active: yup.boolean().required('Active Requires a value'),
  production: yup.boolean().required('Production Requires a value'),
  nodeDependency: yup.boolean().required('Node Dependency Requires a value'),
  displayFile: yup.string().required('Display File Requires a value'),
  componentPath: yup.string().required('Component Path Requires a value'),
  settings: yup.array().required(),
});
