import { advanceTo } from 'jest-date-mock';
import { UserNotFoundError } from '../errors';
import { CognitoClient, UserPoolClient } from '../services';
import { Triggers } from '../services/triggers';
import { ForgotPassword, ForgotPasswordTarget } from './forgotPassword';

describe('ForgotPassword target', () => {
  let forgotPassword: ForgotPasswordTarget;
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
      deleteUser: jest.fn(),
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

    forgotPassword = ForgotPassword({
      cognitoClient: mockCognitoClient,
      codeDelivery: mockCodeDelivery,
      triggers: mockTriggers,
    });
  });

  it("throws if user doesn't exist", async () => {
    mockUserPoolClient.getUserByUsername.mockResolvedValue(null);

    await expect(
      forgotPassword({
        ClientId: 'clientId',
        Username: '0000-0000',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("sends a confirmation code to the user's email address", async () => {
    mockUserPoolClient.getUserByUsername.mockResolvedValue({
      Attributes: [{ Name: 'email', Value: 'example@example.com' }],
      Enabled: true,
      Password: 'hunter2',
      UserCreateDate: now.getTime(),
      UserLastModifiedDate: now.getTime(),
      UserStatus: 'CONFIRMED',
      Username: '0000-0000',
    });
    mockCodeDelivery.mockResolvedValue('1234');

    const result = await forgotPassword({
      ClientId: 'clientId',
      Username: '0000-0000',
    });

    expect(mockCodeDelivery).toHaveBeenCalledWith(
      {
        Attributes: [{ Name: 'email', Value: 'example@example.com' }],
        Enabled: true,
        Password: 'hunter2',
        UserCreateDate: now.getTime(),
        UserLastModifiedDate: now.getTime(),
        UserStatus: 'CONFIRMED',
        Username: '0000-0000',
      },
      {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: 'example@example.com',
      },
    );

    expect(result).toEqual({
      CodeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: 'example@example.com',
      },
    });
  });

  it('saves the confirmation code on the user for comparison when confirming', async () => {
    mockUserPoolClient.getUserByUsername.mockResolvedValue({
      Attributes: [{ Name: 'email', Value: 'example@example.com' }],
      Enabled: true,
      Password: 'hunter2',
      UserCreateDate: now.getTime(),
      UserLastModifiedDate: now.getTime(),
      UserStatus: 'CONFIRMED',
      Username: '0000-0000',
    });
    mockCodeDelivery.mockResolvedValue('1234');

    await forgotPassword({
      ClientId: 'clientId',
      Username: '0000-0000',
    });

    expect(mockUserPoolClient.saveUser).toHaveBeenCalledWith({
      Attributes: [{ Name: 'email', Value: 'example@example.com' }],
      ConfirmationCode: '1234',
      Enabled: true,
      Password: 'hunter2',
      UserCreateDate: now.getTime(),
      UserLastModifiedDate: now.getTime(),
      // TODO: validate whether an already confirmed user should stay confirmed when password reset starts?
      UserStatus: 'CONFIRMED',
      Username: '0000-0000',
    });
  });
});
