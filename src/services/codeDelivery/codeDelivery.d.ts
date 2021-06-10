import { User } from '../userPoolClient';
import { CodeSender } from './codeSender';
export declare type DeliveryDetails =
  | {
      AttributeName: 'email';
      DeliveryMedium: 'EMAIL';
      Destination: string;
    }
  | {
      AttributeName: 'phone_number';
      DeliveryMedium: 'SMS';
      Destination: string;
    };
export declare type CodeDelivery = (user: User, deliveryDetails: DeliveryDetails) => Promise<string>;
export declare const createCodeDelivery: (sender: CodeSender, otp: () => string) => CodeDelivery;
