import {RequestType} from './route/requestType';
import * as glob from './glob';
import Database from './usecases/database';
import {currentTimeString, prettytime} from './utils/timeUtils';
import fastify, {
  FastifyError,
  FastifyReply,
  FastifyRequest,
  HTTPMethods,
} from 'fastify';
import {getAllFiles} from '@a73/get-all-files-ts';
import routeHandler from './route/routeHandler';
import path from 'path';
import * as fs from 'fs';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import {loadIP2LocationDB} from './utils/gelocUtils';

const SERVER = fastify();

(async () => {
  SERVER.register(fastifyMultipart, {attachFieldsToBody: true});
  SERVER.register(fastifyStatic, {
    root: path.join(process.cwd(), 'assets'),
    prefix: '/assets/',
  });
  const missingKeys = glob.loadEnv();
  if (!missingKeys) {
    console.log('.env not found, please create one!');
    return;
  }
  if (missingKeys.length > 0) {
    console.log(
      `Missing ${
        missingKeys.length <= 1 ? 'EnvKey' : 'EnvKeys'
      }: ${missingKeys.join(', ')}`
    );
    return;
  }

  await loadIP2LocationDB();

  console.log('Connecting to database...');

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

  const routesDir = path.join(__dirname, 'route', 'impl');
  const files = await getAllFiles(routesDir).toArray();
  files.forEach(file => {
    if (file && file.endsWith('.ts')) {
      const route = require(file as string);
      const newRoute = new route.default();
      routes.push(newRoute);
    }
  });

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
            host: route.constraints ? `${route.constraints}.${domain}` : domain,
          },
        });
        console.log(
          `Registering ${requestType} request route to ${
            route.constraints ? `${route.constraints}.${domain}` : domain
          }${route.path}`
        );
      }
    });
  }

  SERVER.addHook(
    'preHandler',
    (request: FastifyRequest, _reply: FastifyReply, done) => {
      const start = performance.now();
      done();
      const processTime = prettytime(performance.now() - start);
      const ip =
        'cf-connecting-ip' in request.headers
          ? request.headers['cf-connecting-ip']
          : request.ip;
      console.log(
        `[${currentTimeString()}] ${ip} - ${request.method}@${
          request.raw.url
        } | ${processTime}`
      );
    }
  );

  SERVER.setErrorHandler(function (error, request, reply) {
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
      console.log('trying to use Unix path ' + unixPathEnv);
      SERVER.listen({path: unixPathEnv});
      console.log('Using Unix path ' + unixPathEnv);
    } else {
      console.log(`Trying to listen on ${host}:${port}...`);
      await SERVER.listen({host, port});
      console.log(`listening on ${host}:${port}`);
    }
  } catch (err) {
    console.log(err);
    throw Error(`Failed to bind to port ${port}!`);
  }
})();
