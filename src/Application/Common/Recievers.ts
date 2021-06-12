/**
 * This enumerator is used for specifying the intent of a message to a component
 * This should be used in the case of: ComponentManager --> Component Messaging.
 * Note: A component will only react to these headers.
 */
export enum ComponentRecievers {
  Config = 'Config',
}

/**
 * This enumerator is used for specifying the intent of a message to the Component Manager
 * This should be used in the case of: Component --> ComponentManager Messaging.
 * Note: The component manager will only react to these headers.
 */
export enum ManagerRecievers {
  Error = 'Error',
  Warning = 'Warning',
  Log = 'Log',
  AppConfig = 'AppConfig',

  // These are only used by the interface
  GetComponents = 'GetComponents',
  GetComponent = 'GetComponent',
  SetComponent = 'SetComponent',
}
