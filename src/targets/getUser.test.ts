import { advanceTo } from 'jest-date-mock';
import jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { InvalidParameterError } from '../errors';
import PrivateKey from '../keys/cognitoMock.private.json';
import { CognitoClient, UserPoolClient } from '../services';
import { Triggers } from '../services/triggers';
import { GetUser, GetUserTarget } from './getUser';

describe('GetUser target', () => {
  let getUser: GetUserTarget;
  let mockCognitoClient: jest.Mocked<CognitoClient>;
  let mockUserPoolClient: jest.Mocked<UserPoolClient>;
  let mockCodeDelivery: jest.Mock;
  let mockTriggers: jest.Mocked<Triggers>;
  let now: Date;

  beforeEach(() => {
    now = new Date(2020, 1, 2, 3, 4, 5);
    advanceTo(now);

    mockUserPoolClient = {
      config: {
        Id: 'test',
      },
      createAppClient: jest.fn(),
      getUserByUsername: jest.fn(),
      listUsers: jest.fn(),
      saveUser: jest.fn(),
    };
    mockCognitoClient = {
      getUserPool: jest.fn().mockResolvedValue(mockUserPoolClient),
      getUserPoolForClientId: jest.fn().mockResolvedValue(mockUserPoolClient),
    };
    mockCodeDelivery = jest.fn();
    mockTriggers = {
      enabled: jest.fn(),
      postConfirmation: jest.fn(),
      userMigration: jest.fn(),
    };

    getUser = GetUser({
      cognitoClient: mockCognitoClient,
      codeDelivery: mockCodeDelivery,
      triggers: mockTriggers,
    });
  });

  it('parses token get user by sub', async () => {
    mockUserPoolClient.getUserByUsername.mockResolvedValue({
      Attributes: [],
      UserStatus: 'CONFIRMED',
      Password: 'hunter2',
      Username: '0000-0000',
      Enabled: true,
      UserCreateDate: new Date().getTime(),
      UserLastModifiedDate: new Date().getTime(),
      ConfirmationCode: '1234',
    });

    const output = await getUser({
      AccessToken: jwt.sign(
        {
          sub: '0000-0000',
          event_id: '0',
          token_use: 'access',
          scope: 'aws.cognito.signin.user.admin',
          auth_time: new Date(),
          jti: uuid.v4(),
          client_id: 'test',
          username: '0000-0000',
        },
        PrivateKey.pem,
        {
          algorithm: 'RS256',
          issuer: `http://localhost:9229/test`,
          expiresIn: '24h',
          keyid: 'CognitoMock',
        },
      ),
    });

    expect(output).toBeDefined();
    expect(output).toEqual({
      UserAttributes: [],
      Username: '0000-0000',
    });
  });

  it("throws if token isn't valid", async () => {
    await expect(
      getUser({
        AccessToken: 'blah',
      }),
    ).rejects.toBeInstanceOf(InvalidParameterError);
  });

  it("returns null if user doesn't exist", async () => {
    mockUserPoolClient.getUserByUsername.mockResolvedValue(null);

    const output = await getUser({
      AccessToken: jwt.sign(
        {
          sub: '0000-0000',
          event_id: '0',
          token_use: 'access',
          scope: 'aws.cognito.signin.user.admin',
          auth_time: new Date(),
          jti: uuid.v4(),
          client_id: 'test',
          username: '0000-0000',
        },
        PrivateKey.pem,
        {
          algorithm: 'RS256',
          issuer: `http://localhost:9229/test`,
          expiresIn: '24h',
          keyid: 'CognitoMock',
        },
      ),
    });

    expect(output).toBeNull();
  });
});
