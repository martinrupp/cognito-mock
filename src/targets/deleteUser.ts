import jwt from 'jsonwebtoken';
import { InvalidParameterError, NotAuthorizedError } from '../errors';
import log from '../log';
import { Services } from '../services';
import { Token } from '../services/tokens';
import { MFAOption, UserAttribute } from '../services/userPoolClient';

interface Input {
  AccessToken: string;
}

export type GetUserTarget = (body: Input) => Promise<null>;

export const DeleteUser = ({ cognitoClient }: Services): GetUserTarget => async (body) => {
  const decodedToken = jwt.decode(body.AccessToken) as Token | null;
  if (!decodedToken) {
    log.info('Unable to decode token');
    throw new InvalidParameterError();
  }

  const { sub, client_id } = decodedToken;
  if (!sub || !client_id) {
    return null;
  }

  const userPool = await cognitoClient.getUserPoolForClientId(client_id);
  const user = await userPool.getUserByUsername(sub);
  if (!user) {
    throw new NotAuthorizedError();
  }

  userPool.deleteUser(user);

  return null;
};
