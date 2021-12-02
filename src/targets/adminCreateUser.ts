import * as uuid from 'uuid';
import { UsernameExistsError } from '../errors';
import { Services } from '../services';
import { User, UserAttribute } from '../services/userPoolClient';
import { DynamoDBUserRecord } from './listUsers';

interface Input {
  UserPoolId: string;
  Username: string;
  TemporaryPassword: string;
  ForceAliasCreation: boolean;
  MessageAction: string;
  UserAttributes: UserAttribute[];
}

interface Output {
  User: DynamoDBUserRecord;
}

export type AdminCreateUserTarget = (body: Input) => Promise<Output>;

export const AdminCreateUser = ({ cognitoClient }: Services): AdminCreateUserTarget => async (body) => {
  const userPool = await cognitoClient.getUserPool(body.UserPoolId);
  const existingUser = await userPool.getUserByUsername(body.Username);
  if (existingUser) {
    console.dir('An account with the given email already exists');
    throw new UsernameExistsError();
  }

  const now = new Date().getTime();
  const userId = uuid.v4();
  const user: User = {
    Username: userId,
    Attributes: [...body.UserAttributes, { Name: 'sub', Value: userId }],
    UserCreateDate: now,
    UserLastModifiedDate: now,
    Enabled: true,
    Password: body.TemporaryPassword,
    UserStatus: 'FORCE_CHANGE_PASSWORD',
  };

  await userPool.saveUser(user);
  return {
    User: user,
  };
};
