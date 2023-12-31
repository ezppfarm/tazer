import {RequestType} from './app/route/requestType';
import * as glob from './glob';
import Database from './app/usecases/database';
import {currentTimeString, prettytime} from './app/utils/timeUtils';
import fastify, {
  FastifyError,
  FastifyReply,
  FastifyRequest,
  HTTPMethods,
} from 'fastify';
import {getAllFiles} from '@a73/get-all-files-ts';
import routeHandler from './app/route/routeHandler';
import path from 'path';
import * as fs from 'fs';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import {loadIP2LocationDB} from './app/utils/gelocUtils';
import * as logger from './app/log/logger';
import {run} from './setup';
import {check} from 'tcp-port-used';

const SERVER = fastify();

(async () => {
  SERVER.register(fastifyMultipart, {attachFieldsToBody: true});
  SERVER.register(fastifyStatic, {
    root: path.join(process.cwd(), 'assets'),
    prefix: '/assets/',
  });
  let missingKeys = glob.loadEnv();
  if (!missingKeys) {
    // logger.warn('.env not found, please create one!');
    const setupWizard = await run();
    if (!setupWizard) return;
    const commentLine = `# Configuration generated on ${currentTimeString()}`;
    const envContent = Object.entries(setupWizard)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    const finalEnvContent = `${commentLine}\n${envContent}`;
    await fs.promises.writeFile(
      path.join(process.cwd(), '.env'),
      finalEnvContent
    );

    missingKeys = glob.loadEnv();
    if (!missingKeys) {
      logger.success('failed to create .env file!');
      return;
    }
    logger.success('.env file created!');
    if (missingKeys.length > 0) {
      logger.warn(
        `Missing ${
          missingKeys.length <= 1 ? 'EnvKey' : 'EnvKeys'
        }: ${missingKeys.join(', ')}`
      );
      return;
    }
  } else if (missingKeys.length > 0) {
    logger.warn(
      `Missing ${
        missingKeys.length <= 1 ? 'EnvKey' : 'EnvKeys'
      }: ${missingKeys.join(', ')}`
    );
    return;
  }

  await loadIP2LocationDB();

  await glob.database(
    new Database({
      host: glob.getEnv('MYSQL_HOST', '127.0.0.1') as string,
      port: parseInt(glob.getEnv('MYSQL_PORT', '3306') as string),
      username: glob.getEnv('MYSQL_USER', '') as string,
      password: glob.getEnv('MYSQL_PASS', '') as string,
      database: glob.getEnv('MYSQL_DB', 'tazer') as string,
    })
  );

  const routes: routeHandler[] = [];

  const routesDir = path.join(process.cwd(), 'app', 'route', 'impl');
  const files = await getAllFiles(routesDir).toArray();
  for (const file of files) {
    if (file && file.endsWith('.ts')) {
      const route = await import(file as string);
      const newRoute = new route.default();
      routes.push(newRoute);
    }
  }
  SERVER.setErrorHandler(
    (err: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(err.statusCode ?? 400).send({
        code: err.statusCode,
        message: err.message,
      });
    }
  );

  SERVER.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(404).send({
      code: 404,
      message: 'Not Found',
    });
  });

  const domain = glob.getDomain();

  for (const requestType in RequestType) {
    routes.forEach((route: routeHandler) => {
      if (route.requestTypes.includes(requestType as RequestType)) {
        SERVER.route({
          method: requestType as HTTPMethods,
          url: route.path,
          handler: route.handle,
          constraints: {
            host: route.constraints ?? domain,
          },
        });
        logger.info(
          `Registering ${requestType} request route to ${
            route.constraints ?? domain
          }${route.path}`
        );
      }
    });
  }

  SERVER.addHook(
    'onResponse',
    (request: FastifyRequest, reply: FastifyReply) => {
      const processTime = prettytime(reply.getResponseTime(), {short: true});
      const ip =
        'cf-connecting-ip' in request.headers
          ? request.headers['cf-connecting-ip']
          : request.ip;

      //Ignore websocket requests for now
      if (!request.originalUrl.endsWith('negotiateVersion=1'))
        logger.info(
          `[${currentTimeString()}] ${reply.statusCode} | ${ip} | ${
            request.method
          }@${request.hostname + request.originalUrl} - ${processTime}`
        );
    }
  );

  SERVER.setErrorHandler(function (error, _request, reply) {
    if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      // Log error
      this.log.error(error);
      console.log(error);
      // Send error response
      reply.status(500).send({ok: false});
    } else {
      // fastify will use parent error handler to handle this
      reply.send(error);
      console.log(error);
    }
  });

  const unixPathEnv = glob.getEnv('UNIX_LISTEN');
  if (unixPathEnv && unixPathEnv.length > 0) {
    if (fs.existsSync(unixPathEnv)) await fs.promises.unlink(unixPathEnv);
  }

  const host = glob.getEnv('HTTP_HOST', 'localhost');
  const port = parseInt(glob.getEnv('HTTP_PORT', '8041') as string);

  try {
    if (unixPathEnv && process.platform !== 'win32') {
      logger.info('trying to use Unix path ' + unixPathEnv);
      SERVER.listen({path: unixPathEnv});
      logger.success('Using Unix path ' + unixPathEnv);
    } else {
      logger.info(`Trying to listen on ${host}:${port}...`);
      const isPortUsed = await check(port, host);
      if (isPortUsed)
        throw Error(`Port ${port} is already used by another application!`);
      await SERVER.listen({host, port});
      logger.success(`listening on ${host}:${port}`);
    }
  } catch (err) {
    console.log(err);
    throw Error(`Failed to bind to port ${port}!`);
  }
})();
