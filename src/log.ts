import debug from "debug";

const logger = debug("CognitoMock");

export default {
  info: console.log,
  error: console.error,
  debug(...args: any[]) {
    if (logger.enabled) {
      logger.log(...args);
    }
  },
};
