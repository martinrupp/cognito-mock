import { Response } from 'express';
export declare class UnsupportedError extends Error {}
export declare class CognitoError extends Error {
  readonly code: string;
  constructor(code: string, message: string);
}
export declare class NotAuthorizedError extends CognitoError {
  constructor();
}
export declare class UserNotFoundError extends CognitoError {
  constructor();
}
export declare class UsernameExistsError extends CognitoError {
  constructor();
}
export declare class CodeMismatchError extends CognitoError {
  constructor();
}
export declare class InvalidPasswordError extends CognitoError {
  constructor();
}
export declare class PasswordResetRequiredError extends CognitoError {
  constructor();
}
export declare class ResourceNotFoundError extends CognitoError {
  constructor();
}
export declare class UnexpectedLambdaExceptionError extends CognitoError {
  constructor();
}
export declare class InvalidParameterError extends CognitoError {
  constructor();
}
export declare const unsupported: (message: string, res: Response<any>) => Response<any>;
