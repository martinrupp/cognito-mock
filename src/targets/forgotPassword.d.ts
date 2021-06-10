import { Services } from '../services';
import { DeliveryDetails } from '../services/codeDelivery/codeDelivery';
interface Input {
  ClientId: string;
  Username: string;
}
interface Output {
  CodeDeliveryDetails: DeliveryDetails;
}
export declare type ForgotPasswordTarget = (body: Input) => Promise<Output>;
export declare const ForgotPassword: ({ cognitoClient, codeDelivery }: Services) => ForgotPasswordTarget;
export {};
