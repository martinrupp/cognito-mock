import { AppClient } from './appClient';
import { CreateDataStore, DataStore } from './dataStore';
export interface UserAttribute {
  Name: 'sub' | 'email' | 'phone_number' | 'preferred_username' | string;
  Value: string;
}
export interface MFAOption {
  DeliveryMedium: 'SMS';
  AttributeName: 'phone_number';
}
export declare const attributesIncludeMatch: (
  attributeName: string,
  attributeValue: string,
  attributes: readonly UserAttribute[],
) => boolean;
export declare const attributesInclude: (attributeName: string, attributes: readonly UserAttribute[]) => boolean;
export declare const attributeValue: (attributeName: string, attributes: readonly UserAttribute[]) => string;
export declare const attributesToRecord: (attributes: readonly UserAttribute[]) => Record<string, string>;
export declare const attributesFromRecord: (attributes: Record<string, string>) => readonly UserAttribute[];
export interface User {
  Username: string;
  UserCreateDate: number;
  UserLastModifiedDate: number;
  Enabled: boolean;
  UserStatus: 'CONFIRMED' | 'UNCONFIRMED' | 'RESET_REQUIRED';
  Attributes: readonly UserAttribute[];
  MFAOptions?: readonly MFAOption[];
  Password: string;
  ConfirmationCode?: string;
  MFACode?: string;
}
declare type UsernameAttribute = 'email' | 'phone_number';
export interface UserPool {
  Id: string;
  UsernameAttributes?: UsernameAttribute[];
  MfaConfiguration?: 'OFF' | 'ON' | 'OPTIONAL';
  AutoConfirmed?: boolean;
}
export interface UserPoolClient {
  readonly config: UserPool;
  createAppClient(name: string): Promise<AppClient>;
  getUserByUsername(username: string): Promise<User | null>;
  listUsers(): Promise<readonly User[]>;
  saveUser(user: User): Promise<void>;
}
export declare type CreateUserPoolClient = (
  defaultOptions: UserPool,
  clientsDataStore: DataStore,
  createDataStore: CreateDataStore,
) => Promise<UserPoolClient>;
export declare const createUserPoolClient: (
  defaultOptions: UserPool,
  clientsDataStore: DataStore,
  createDataStore: CreateDataStore,
) => Promise<UserPoolClient>;
export {};
