import { CognitoUserPoolEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
interface UserMigrationEvent {
  userPoolId: string;
  clientId: string;
  username: string;
  password: string;
  userAttributes: Record<string, string>;
  triggerSource: 'UserMigration_Authentication';
}
interface PostConfirmationEvent {
  userPoolId: string;
  clientId: string;
  username: string;
  userAttributes: Record<string, string>;
  triggerSource: 'PostConfirmation_ConfirmSignUp' | 'PostConfirmation_ConfirmForgotPassword';
}
export declare type CognitoUserPoolResponse = CognitoUserPoolEvent['response'];
export interface Lambda {
  invoke(lambda: 'UserMigration', event: UserMigrationEvent): Promise<CognitoUserPoolResponse>;
  invoke(lambda: 'PostConfirmation', event: PostConfirmationEvent): Promise<CognitoUserPoolResponse>;
  enabled(lambda: 'UserMigration'): boolean;
}
export interface FunctionConfig {
  UserMigration?: string;
  PostConfirmation?: string;
}
export declare type CreateLambda = (config: FunctionConfig, lambdaClient: AWS.Lambda) => Lambda;
export declare const createLambda: CreateLambda;
export {};
