import { CreateDataStore } from './dataStore';
import { CreateUserPoolClient, UserPool, UserPoolClient } from './userPoolClient';
export interface CognitoClient {
  getUserPool(userPoolId: string): Promise<UserPoolClient>;
  getUserPoolForClientId(clientId: string): Promise<UserPoolClient>;
}
export declare const createCognitoClient: (
  userPoolDefaultOptions: UserPool,
  createDataStore: CreateDataStore,
  createUserPoolClient: CreateUserPoolClient,
) => Promise<CognitoClient>;
