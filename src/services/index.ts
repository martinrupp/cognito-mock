import { Triggers } from './triggers';
import { CodeDelivery } from './codeDelivery/codeDelivery';
import { CognitoClient } from './cognitoClient';

export type { CognitoClient } from './cognitoClient';
export type { UserPoolClient } from './userPoolClient';
export { createCodeDelivery } from './codeDelivery/codeDelivery';
export type { CodeDelivery } from './codeDelivery/codeDelivery';

export interface Services {
  cognitoClient: CognitoClient;
  codeDelivery: CodeDelivery;
  triggers: Triggers;
}
