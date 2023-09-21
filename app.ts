import {
  HTTPMethod,
  HTTPServer,
} from "https://deno.land/x/rapid@v0.3.0/mod.ts";
import * as path from "https://deno.land/std@0.201.0/path/mod.ts";

import { recursiveReaddir } from "./utils/fileUtil.ts";
import { RequestType } from "./route/requestType.ts";
import * as glob from "./glob.ts";
import Database from "./usecases/database.ts";

const server = new HTTPServer(false);

console.log("Connecting to database...");

await glob.database(
  new Database({
    endpoint: glob.getEnv("SURREAL_HOST", "http://127.0.0.1:8000/rpc"),
    username: glob.getEnv("SURREAL_USER", ""),
    password: glob.getEnv("SURREAL_PASS", ""),
    database: glob.getEnv("SURREAL_DB", "tazer"),
  }),
);

for await (
  const route of recursiveReaddir(
    path.join(Deno.cwd(), "route", "impl"),
  )
) {
  const routeObj = await import(`./${route}`);
  const newRoute = new routeObj.default();
  for (const requestType in RequestType) {
    if (newRoute.requestTypes.includes(requestType)) {
      server.add(
        requestType as HTTPMethod,
        newRoute.path,
        newRoute.handle,
      );
      console.log(`registered path ${requestType}@${newRoute.path}`);
    }
  }
}

const listenType = glob.getEnv("LISTEN_TYPE", "TCP").toUpperCase();

if (listenType != "UNIX" && listenType != "TCP") {
  console.log(`unsupported listen type "${listenType}"`);
  Deno.exit(0);
}

if (listenType == "UNIX" && Deno.build.os == "windows") {
  console.log("UNIX listen type is not supported on Windows!");
  Deno.exit(0);
}
try {
  const host = glob.getEnv("HTTP_HOST", "localhost");
  const port = parseInt(glob.getEnv("HTTP_PORT", "8041"));
  const unixPath = glob.getEnv("UNIX_LISTEN_PATH", "/temp/tazer.sock");

  server.listen({
    unixPath: listenType == "UNIX" ? unixPath : undefined,
    port,
    host,
  });
  console.log(
    `http server is listening on ${
      listenType == "UNIX"
        ? `unix:${unixPath}`
        : `http://${host.length > 0 ? host : "localhost"}:${port}`
    }`,
  );
} catch (err) {
  console.log(err);
  Deno.exit(0);
}

Deno.addSignalListener("SIGINT", () => {
  console.log("stopping http server...");
  server.close();
  console.log("shutting down...");
  Deno.exit(0);
});
