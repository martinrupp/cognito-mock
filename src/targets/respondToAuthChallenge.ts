import { attributesToRecord, attributeValue } from '../services/userPoolClient';
import { CodeMismatchError, NotAuthorizedError } from '../errors';
import { Services } from '../services';
import { generateTokens } from '../services/tokens';

interface Input {
  ChallengeName: 'SMS_MFA' | 'NEW_PASSWORD_REQUIRED';
  ChallengeResponses: {
    NEW_PASSWORD: string;
    'userAttributes.family_name': string;
    'userAttributes.given_name': string;
    USERNAME: string;
    SMS_MFA_CODE: string;
  };
  ClientId: string;
  Session: string | null;
}

interface Output {
  ChallengeName?: string;
  ChallengeParameters?: {};
  AuthenticationResult: {
    IdToken: string;
    AccessToken: string;
    RefreshToken: string;
  };
  Session: string | null;
}

export type RespondToAuthChallengeTarget = (body: Input) => Promise<Output>;

export const RespondToAuthChallenge = ({ cognitoClient }: Services): RespondToAuthChallengeTarget => async (body) => {
  const userPool = await cognitoClient.getUserPoolForClientId(body.ClientId);
  const user = await userPool.getUserByUsername(body.ChallengeResponses.USERNAME);
  if (!user) {
    throw new NotAuthorizedError();
  }

  if (body.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    // && user.UserStatus === 'FORCE_CHANGE_PASSWORD') {
    await userPool.saveUser({
      ...user,
      Attributes: [
        { Name: 'sub', Value: attributeValue('sub', user.Attributes) },
        { Name: 'email', Value: attributeValue('email', user.Attributes) },
        { Name: 'given_name', Value: body.ChallengeResponses['userAttributes.given_name'] },
        { Name: 'family_name', Value: body.ChallengeResponses['userAttributes.family_name'] },
      ],
      UserStatus: 'CONFIRMED',
    });

    return {
      AuthenticationResult: generateTokens(user, body.ClientId, userPool.config.Id),
      Session: body.Session,
    };
  } else {
    if (user.MFACode !== body.ChallengeResponses.SMS_MFA_CODE) {
      throw new CodeMismatchError();
    }

    await userPool.saveUser({
      ...user,
      MFACode: undefined,
    });
  }

  return {
    ChallengeName: body.ChallengeName,
    ChallengeParameters: {
      USER_ID_FOR_SRP: user.Username,
      requiredAttributes: JSON.stringify([]),
      userAttributes: JSON.stringify(attributesToRecord(user.Attributes)),
    },
    AuthenticationResult: generateTokens(user, body.ClientId, userPool.config.Id),
    Session: body.Session,
  };
};
