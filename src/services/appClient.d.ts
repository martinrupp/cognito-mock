export interface AppClient {
  UserPoolId: string;
  ClientName: string;
  ClientId: string;
  LastModifiedDate: number;
  CreationDate: number;
  RefreshTokenValidity: number;
  AllowedOAuthFlowsUserPoolClient: boolean;
}
export declare const newId: () => string;
