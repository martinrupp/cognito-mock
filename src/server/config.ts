import deepmerge from 'deepmerge';
import { createDataStore } from '../services/dataStore';
import { FunctionConfig } from '../services/lambda';
import { UserPool } from '../services/userPoolClient';

export interface Config {
  LambdaClient: AWS.Lambda.ClientConfiguration;
  TriggerFunctions: FunctionConfig;
  UserPoolDefaults: UserPool;
}

const defaults: Config = {
  LambdaClient: {
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
    region: 'local',
  },
  TriggerFunctions: {},
  UserPoolDefaults: {
    Id: 'local',
    UsernameAttributes: ['email'],
    AutoConfirmed: true,
  },
};

export const loadConfig = async (): Promise<Config> => {
  const dataStore = await createDataStore(
    'config',
    defaults,
    process.env.isRoot ? `${process.env.HOME}/.cognito` : '.cognito',
  );
  const config = await dataStore.getRoot<Config>();
  return deepmerge(defaults, config ?? {});
};
