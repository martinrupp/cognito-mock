import { Services } from '../services';
interface Input {
  ChallengeName: 'SMS_MFA';
  ChallengeResponses: {
    USERNAME: string;
    SMS_MFA_CODE: string;
  };
  ClientId: string;
  Session: string | null;
}
interface Output {
  ChallengeName: string;
  ChallengeParameters: {};
  AuthenticationResult: {
    IdToken: string;
    AccessToken: string;
    RefreshToken: string;
  };
  Session: string | null;
}
export declare type RespondToAuthChallengeTarget = (body: Input) => Promise<Output>;
export declare const RespondToAuthChallenge: ({ cognitoClient }: Services) => RespondToAuthChallengeTarget;
export {};
