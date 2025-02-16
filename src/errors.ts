/* eslint-disable max-classes-per-file */
import { Response } from 'express';

export class UnsupportedError extends Error {}

export class CognitoError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.code = `CognitoMock#${code}`;
  }
}

export class NotAuthorizedError extends CognitoError {
  public constructor() {
    super('NotAuthorizedException', 'User not authorized');
  }
}

export class UserNotFoundError extends CognitoError {
  public constructor() {
    super('UserNotFoundException', 'User not found');
  }
}

export class UsernameExistsError extends CognitoError {
  public constructor() {
    super('UsernameExistsException', 'User already exists');
  }
}

export class CodeMismatchError extends CognitoError {
  public constructor() {
    super('CodeMismatchException', 'Incorrect confirmation code');
  }
}

export class InvalidPasswordError extends CognitoError {
  public constructor() {
    super('InvalidPasswordException', 'Invalid password');
  }
}

export class PasswordResetRequiredError extends CognitoError {
  public constructor() {
    super('PasswordResetRequiredException', 'Password reset required');
  }
}

export class ResourceNotFoundError extends CognitoError {
  public constructor() {
    super('ResourceNotFoundException', 'Resource not found');
  }
}

export class UnexpectedLambdaExceptionError extends CognitoError {
  public constructor() {
    super('UnexpectedLambdaExceptionException', 'Unexpected error when invoking lambda');
  }
}

export class InvalidParameterError extends CognitoError {
  public constructor() {
    super('InvalidParameterException', 'Invalid parameter');
  }
}

export const unsupported = (message: string, res: Response) => {
  console.error(`Cognito Local unsupported feature: ${message}`);
  return res.status(500).json({
    code: 'CognitoMock#Unsupported',
    message: `Cognito Local unsupported feature: ${message}`,
  });
};
