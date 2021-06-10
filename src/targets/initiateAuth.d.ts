import { Services } from '../services';
interface Input {
  AuthFlow: 'USER_PASSWORD_AUTH' | 'CUSTOM_AUTH';
  ClientId: string;
  AuthParameters: {
    USERNAME: string;
    PASSWORD: string;
  };
  Session: string | null;
}
export interface SmsMfaOutput {
  ChallengeName: 'SMS_MFA';
  ChallengeParameters: {
    CODE_DELIVERY_DELIVERY_MEDIUM: 'SMS';
    CODE_DELIVERY_DESTINATION: string;
    USER_ID_FOR_SRP: string;
  };
  Session: string | null;
}
export interface PasswordVerifierOutput {
  ChallengeName: 'PASSWORD_VERIFIER';
  ChallengeParameters: {};
  Session: string | null;
  AuthenticationResult: {
    IdToken: string;
    AccessToken: string;
    RefreshToken: string;
  };
}
export declare type Output = SmsMfaOutput | PasswordVerifierOutput;
export declare type InitiateAuthTarget = (body: Input) => Promise<Output>;
export declare const InitiateAuth: ({ codeDelivery, cognitoClient, triggers }: Services) => InitiateAuthTarget;
export {};
