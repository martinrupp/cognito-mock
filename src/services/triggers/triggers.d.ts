import { CognitoClient } from '../index';
import { Lambda } from '../lambda';
import { PostConfirmationTrigger } from './postConfirmation';
import { UserMigrationTrigger } from './userMigration';
export interface Triggers {
  enabled(trigger: 'UserMigration' | 'PostConfirmation'): boolean;
  userMigration: UserMigrationTrigger;
  postConfirmation: PostConfirmationTrigger;
}
export declare const createTriggers: (services: { lambda: Lambda; cognitoClient: CognitoClient }) => Triggers;
