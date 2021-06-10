import { Services } from '../services';
interface Input {
  ClientId: string;
  Username: string;
  Password: string;
  UserAttributes: readonly {
    Name: string;
    Value: string;
  }[];
}
interface Output {
  UserConfirmed: boolean;
  UserSub: string;
  CodeDeliveryDetails: {
    AttributeName?: string;
    DeliveryMedium?: string;
    Destination?: string;
  };
}
export declare type SignUpTarget = (body: Input) => Promise<Output>;
export declare const SignUp: ({ cognitoClient, codeDelivery }: Services) => SignUpTarget;
export {};
