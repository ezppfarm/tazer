import { RequestType } from "./route/requestType";
import * as glob from "./glob";
import Database from "./usecases/database";
import { moment, prettytime } from "./utils/timeUtils";
import fastify, { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { getAllFiles } from "@a73/get-all-files-ts";
import routeHandler from "./route/routeHandler";
import path from "path";
import * as fs from "fs";

const server = fastify();

(async () => {
  const missingKeys = glob.loadEnv();
  if (missingKeys.length > 0) {
    console.log(
      `Missing ${missingKeys.length <= 1 ? `EnvKey` : `EnvKeys`}: ${
        missingKeys.join(", ")
      }`,
    );
    return;
  }
  console.log("Connecting to database...");

  await glob.database(
    new Database({
      endpoint: glob.getEnv(
        "SURREAL_HOST",
        "http://127.0.0.1:8000/rpc",
      ) as string,
      username: glob.getEnv("SURREAL_USER", "") as string,
      password: glob.getEnv("SURREAL_PASS", "") as string,
      database: glob.getEnv("SURREAL_DB", "tazer") as string,
    }),
  );

  const routes: routeHandler[] = [];

  const routesDir = path.join(__dirname, "route", "impl");
  const files = await getAllFiles(routesDir).toArray();
  files.forEach((file) => {
    if (file && file.endsWith(".ts")) {
      const route = require(file as string);
      const newRoute = new route.default();
      routes.push(newRoute);
    }
  });

  for (const requestType in RequestType) {
    routes.forEach((route: routeHandler) => {
      if (route.requestTypes.includes(requestType as RequestType)) {
        server.route({
          method: requestType as HTTPMethods,
          url: route.path,
          handler: route.handle,
        });
        console.log(
          `Registering ${requestType} request route to ${route.path}`,
        );
      }
    });
  }

  server.addHook("preHandler", function (
    request: FastifyRequest,
    _reply: FastifyReply,
    done,
  ) {
    const start = performance.now();
    done();
    const processTime = prettytime(performance.now() - start);
    const ip = "cf-connecting-ip" in request.headers
      ? request.headers["cf-connecting-ip"]
      : request.ip;
    console.log(
      `[${
        moment().format("YYYY-MM-DD HH-mm-ss")
      }] ${ip} - ${request.method}@${request.raw.url} | ${processTime}`,
    );
  });

  const unixPathEnv = glob.getEnv("UNIX_LISTEN");
  if (unixPathEnv && unixPathEnv.length > 0) {
    if (fs.existsSync(unixPathEnv)) await fs.promises.unlink(unixPathEnv);
  }

  const host = glob.getEnv("HTTP_HOST", "localhost");
  const port = parseInt(glob.getEnv("HTTP_PORT", "8041") as string);

  try {
    console.log(`Trying to listen on ${host}:${port}...`);
    if (unixPathEnv && process.platform != "win32") {
      server.listen({ path: unixPathEnv });
    } else {
      await server.listen({ host, port });
    }
    console.log(
      `listening on ${host}:${port}`,
    );
  } catch (err) {
    console.log(`Error: ${err}`);
    console.log(`Failed to bind to port ${port}!`);
    process.exit(1);
  }
})();
