import { Services } from '../services';
import { attributeValue, UserAttribute } from '../services/userPoolClient';

interface Input {
  UserPoolId: string;
  AttributesToGet?: string[]; // TODO: filter returned attributes
  Filter?: string; // TODO: filter users before returning
  Limit?: number; // TODO: limit number of returned users
  PaginationToken?: string; // TODO: support pagination
}

export interface DynamoDBUserRecord {
  Username: string;
  UserCreateDate: number;
  UserLastModifiedDate: number;
  Enabled: boolean;
  UserStatus: 'CONFIRMED' | 'UNCONFIRMED' | 'RESET_REQUIRED' | 'FORCE_CHANGE_PASSWORD';
  Attributes: readonly UserAttribute[];
}

interface Output {
  PaginationToken?: string;
  Users: readonly DynamoDBUserRecord[];
}

export type ListUsersTarget = (body: Input) => Promise<Output>;

// see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html
export const ListUsers = ({ cognitoClient }: Services): ListUsersTarget => async (body) => {
  const userPool = await cognitoClient.getUserPool(body.UserPoolId);
  let users = await userPool.listUsers();

  if (body?.Filter) {
    // e.g. 'sub="fa34-a84d"'
    const regex = /([a-z_:]*)[ ]*(\^?=)[ ]*"(.*)"/;
    const res = regex.exec(body.Filter);
    if (res) {
      const supportedFilters = [
        'username',
        'email',
        'phone_number',
        'name',
        'given_name',
        'family_name',
        'preferred_username',
        'cognito:user_status',
        'status',
        'sub',
      ];

      const [, field, eqType, value] = res;
      if (!supportedFilters.includes(field)) {
        throw new Error(`unsupported filter ${field}`);
      }
      // using '=' is equals, ^= is starts with, e.g. 'given_name ^= "Ma"' is first name starting with Ma
      const matchEq = (attr: string) => attr == value;
      const matchStartsWith = (attr: string) => attr && attr.startsWith(value);
      const match = eqType === '^=' ? matchStartsWith : matchEq;
      users = users.filter((e) => match(attributeValue(field, e.Attributes)));
    } else {
      throw new Error(`could not parse filter ${body.Filter}`);
    }
  }

  return {
    Users: users.map((user) => ({
      Username: user.Username,
      UserCreateDate: user.UserCreateDate,
      UserLastModifiedDate: user.UserLastModifiedDate,
      Enabled: user.Enabled,
      UserStatus: user.UserStatus,
      Attributes: user.Attributes,
    })),
  };
};
