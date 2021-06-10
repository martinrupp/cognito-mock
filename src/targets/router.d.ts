import { Services } from '../services';
export declare const Targets: {
  ConfirmForgotPassword: ({
    cognitoClient,
    triggers,
  }: Services) => import('./confirmForgotPassword').ConfirmForgotPasswordTarget;
  ConfirmSignUp: ({ cognitoClient, triggers }: Services) => import('./confirmSignUp').ConfirmSignUpTarget;
  CreateUserPoolClient: ({ cognitoClient }: Services) => import('./createUserPoolClient').CreateUserPoolClientTarget;
  ForgotPassword: ({ cognitoClient, codeDelivery }: Services) => import('./forgotPassword').ForgotPasswordTarget;
  InitiateAuth: ({ codeDelivery, cognitoClient, triggers }: Services) => import('./initiateAuth').InitiateAuthTarget;
  ListUsers: ({ cognitoClient }: Services) => import('./listUsers').ListUsersTarget;
  RespondToAuthChallenge: ({
    cognitoClient,
  }: Services) => import('./respondToAuthChallenge').RespondToAuthChallengeTarget;
  SignUp: ({ cognitoClient, codeDelivery }: Services) => import('./signUp').SignUpTarget;
  GetUser: ({ cognitoClient }: Services) => import('./getUser').GetUserTarget;
};
export declare const isSupportedTarget: (
  name: string,
) => name is
  | 'ConfirmForgotPassword'
  | 'ConfirmSignUp'
  | 'CreateUserPoolClient'
  | 'ForgotPassword'
  | 'InitiateAuth'
  | 'ListUsers'
  | 'RespondToAuthChallenge'
  | 'SignUp'
  | 'GetUser';
export declare type Route = (body: any) => Promise<any>;
export declare type Router = (target: string) => Route;
export declare const Router: (services: Services) => Router;
