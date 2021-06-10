import { User } from './userPoolClient';
export interface Token {
  client_id: string;
  iss: string;
  sub: string;
  token_use: string;
  username: string;
  event_id: string;
  scope: string;
  auth_time: Date;
  jti: string;
}
export declare function generateTokens(
  user: User,
  clientId: string,
  userPoolId: string,
): {
  AccessToken: string;
  IdToken: string;
  RefreshToken: string;
};
