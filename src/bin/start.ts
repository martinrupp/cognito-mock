#!/usr/bin/env node
import yargs from 'yargs';
import AWS from 'aws-sdk';
import { createLambda } from '../services/lambda';
import { createTriggers } from '../services/triggers';
import { createCodeDelivery } from '../services';
import { ConsoleCodeSender } from '../services/codeDelivery/consoleCodeSender';
import { createDataStore } from '../services/dataStore';
import { createUserPoolClient } from '../services/userPoolClient';
import { otp } from '../services/codeDelivery/otp';
import { loadConfig } from '../server/config';
import { createCognitoClient } from '../services/cognitoClient';
import { createDefaultServer } from '../server';
import log from '../log';
import { CreateUserPoolClient } from '../targets/createUserPoolClient';
// eslint-disable-next-line no-unused-expressions
yargs
  .command({
    command: 'start',
    describe: 'start cognito server',
    handler: () => {
      createDefaultServer()
        .then((server) => {
          const hostname = process.env.HOST ?? 'localhost';
          const port = parseInt(process.env.PORT ?? '9229', 10);
          return server.start({ hostname, port });
        })
        .then((httpServer) => {
          const address = httpServer.address();
          if (!address) {
            throw new Error('Server started without address');
          }
          const url = typeof address === 'string' ? address : `${address.address}:${address.port}`;

          log.info(`Cognito Local running on http://${url}`);
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    },
  })
  .command({
    command: 'create-pool',
    describe: 'create cognito user pool',
    builder: (yargs_) =>
      yargs_
        .option('user-pool-id', {
          string: true,
          demand: true,
          describe: '"_"가 꼭 들어가야합니다. ex) local_bone',
        })
        .option('ClientName', { string: true })
        .check(({ userPoolId, clientName }) => true),
    handler: (argv) => {
      const { userPoolId: UserPoolId, clientName: ClientName = 'client' } = (argv as unknown) as {
        userPoolId: string;
        clientName: string | null;
      };
      (async () => {
        const config = await loadConfig();
        log.debug('Loaded config:', config);
        const cognitoClient = await createCognitoClient(config.UserPoolDefaults, createDataStore, createUserPoolClient);
        const lambdaClient = new AWS.Lambda(config.LambdaClient);
        const lambda = createLambda(config.TriggerFunctions, lambdaClient);
        const triggers = createTriggers({
          lambda,
          cognitoClient,
        });
        const { UserPoolClient } = await CreateUserPoolClient({
          codeDelivery: createCodeDelivery(ConsoleCodeSender, otp),
          cognitoClient,
          triggers,
        })({ ClientName, UserPoolId });
        console.log(UserPoolClient);
      })();
    },
  })
  .help()
  .alias('help', 'h').argv;
