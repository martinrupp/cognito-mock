import { FunctionConfig } from '../services/lambda';
import { UserPool } from '../services/userPoolClient';
export interface Config {
  LambdaClient: AWS.Lambda.ClientConfiguration;
  TriggerFunctions: FunctionConfig;
  UserPoolDefaults: UserPool;
}
export declare const loadConfig: () => Promise<Config>;
