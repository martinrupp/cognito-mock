import { Services } from '../services';
interface Input {
  ClientName: string;
  UserPoolId: string;
}
interface Output {
  UserPoolClient: {
    UserPoolId: string;
    ClientName: string;
    ClientId: string;
    LastModifiedDate: number;
    CreationDate: number;
    RefreshTokenValidity: number;
    AllowedOAuthFlowsUserPoolClient: boolean;
  };
}
export declare type CreateUserPoolClientTarget = (body: Input) => Promise<Output>;
export declare const CreateUserPoolClient: ({ cognitoClient }: Services) => CreateUserPoolClientTarget;
export {};
