import { Lambda } from '../lambda';
import { UserPoolClient } from '../userPoolClient';
import { CognitoClient } from '../cognitoClient';
import { PostConfirmation, PostConfirmationTrigger } from './postConfirmation';

describe('PostConfirmation trigger', () => {
  let mockLambda: jest.Mocked<Lambda>;
  let mockCognitoClient: jest.Mocked<CognitoClient>;
  let mockUserPoolClient: jest.Mocked<UserPoolClient>;
  let postConfirmation: PostConfirmationTrigger;

  beforeEach(() => {
    mockLambda = {
      enabled: jest.fn(),
      invoke: jest.fn(),
    };
    mockUserPoolClient = {
      config: {
        Id: 'test',
        AutoConfirmed: false,
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
    postConfirmation = PostConfirmation({
      lambda: mockLambda,
      cognitoClient: mockCognitoClient,
    });
  });

  describe.each(['PostConfirmation_ConfirmSignUp', 'PostConfirmation_ConfirmForgotPassword'])('%s', (source) => {
    describe('when lambda invoke fails', () => {
      it('quietly completes', async () => {
        mockLambda.invoke.mockRejectedValue(new Error('Something bad happened'));

        await postConfirmation({
          userPoolId: 'userPoolId',
          clientId: 'clientId',
          username: 'username',
          userAttributes: [],
          source: source as any,
        });
      });
    });

    describe('when lambda invoke succeeds', () => {
      it('quietly completes', async () => {
        mockLambda.invoke.mockResolvedValue({});

        await postConfirmation({
          userPoolId: 'userPoolId',
          clientId: 'clientId',
          username: 'example@example.com',
          userAttributes: [{ Name: 'email', Value: 'example@example.com' }],
          source: source as any,
        });

        expect(mockLambda.invoke).toHaveBeenCalledWith('PostConfirmation', {
          clientId: 'clientId',
          triggerSource: source,
          userAttributes: { email: 'example@example.com' },
          userPoolId: 'userPoolId',
          username: 'example@example.com',
        });
      });
    });
  });
});
