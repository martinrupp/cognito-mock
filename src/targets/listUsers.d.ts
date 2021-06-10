import { Services } from '../services';
import { UserAttribute } from '../services/userPoolClient';
interface Input {
  UserPoolId: string;
  AttributesToGet?: string[];
  Filter?: string;
  Limit?: number;
  PaginationToken?: string;
}
export interface DynamoDBUserRecord {
  Username: string;
  UserCreateDate: number;
  UserLastModifiedDate: number;
  Enabled: boolean;
  UserStatus: 'CONFIRMED' | 'UNCONFIRMED' | 'RESET_REQUIRED';
  Attributes: readonly UserAttribute[];
}
interface Output {
  PaginationToken?: string;
  Users: readonly DynamoDBUserRecord[];
}
export declare type ListUsersTarget = (body: Input) => Promise<Output>;
export declare const ListUsers: ({ cognitoClient }: Services) => ListUsersTarget;
export {};
