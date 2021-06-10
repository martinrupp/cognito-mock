import { Services } from '../services';
interface Input {
  ClientId: string;
  Username: string;
  ConfirmationCode: string;
  ForceAliasCreation: boolean;
}
export declare type ConfirmSignUpTarget = (body: Input) => Promise<void>;
export declare const ConfirmSignUp: ({ cognitoClient, triggers }: Services) => ConfirmSignUpTarget;
export {};
