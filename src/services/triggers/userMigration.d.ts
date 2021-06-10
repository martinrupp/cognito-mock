import { CognitoClient } from '../index';
import { Lambda } from '../lambda';
import { User, UserAttribute } from '../userPoolClient';
export declare type UserMigrationTrigger = (params: {
  userPoolId: string;
  clientId: string;
  username: string;
  password: string;
  userAttributes: readonly UserAttribute[];
}) => Promise<User>;
export declare const UserMigration: ({
  lambda,
  cognitoClient,
}: {
  lambda: Lambda;
  cognitoClient: CognitoClient;
}) => UserMigrationTrigger;
