import { CognitoClient } from '../index';
import { Lambda } from '../lambda';
export declare type PostConfirmationTrigger = (params: {
  source: 'PostConfirmation_ConfirmSignUp' | 'PostConfirmation_ConfirmForgotPassword';
  userPoolId: string;
  clientId: string;
  username: string;
  userAttributes: readonly {
    Name: string;
    Value: string;
  }[];
}) => Promise<void>;
export declare const PostConfirmation: ({
  lambda,
  cognitoClient,
}: {
  lambda: Lambda;
  cognitoClient: CognitoClient;
}) => PostConfirmationTrigger;
