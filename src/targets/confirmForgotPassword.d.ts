import { Services } from '../services';
interface Input {
  ClientId: string;
  Username: string;
  ConfirmationCode: string;
  Password: string;
}
export declare type ConfirmForgotPasswordTarget = (body: Input) => Promise<{}>;
export declare const ConfirmForgotPassword: ({ cognitoClient, triggers }: Services) => ConfirmForgotPasswordTarget;
export {};
