import { Services } from '../services';
import { MFAOption, UserAttribute } from '../services/userPoolClient';
interface Input {
  AccessToken: string;
}
interface Output {
  Username: string;
  UserAttributes: readonly UserAttribute[];
  MFAOptions?: readonly MFAOption[];
}
export declare type GetUserTarget = (body: Input) => Promise<Output | null>;
export declare const GetUser: ({ cognitoClient }: Services) => GetUserTarget;
export {};
