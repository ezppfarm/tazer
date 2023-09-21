import { HTTPMethod, HTTPServer } from "https://deno.land/x/rapid@v0.2.2/mod.ts";
import * as path from "https://deno.land/std@0.201.0/path/mod.ts";

import { recursiveReaddir } from "./utils/fileUtil.ts";
import { RequestType } from "./route/requestType.ts";

const server = new HTTPServer(false);

const port = 8000;

for await (const route of recursiveReaddir(
    path.join(Deno.cwd(), "route", "impl")
)) {
    const routeObj = await import(`./${route}`);
    const newRoute = new routeObj.default();
    for (const requestType in RequestType) {
        if (newRoute.requestTypes.includes(requestType)) {
            server.add(
                requestType as HTTPMethod,
                newRoute.path,
                newRoute.handle
            );
        }
    }
}

server.listen({
    port,
});

console.log(`http server is listening on http://localhost:${port}`);

Deno.addSignalListener("SIGINT", () => {
    console.log("stopping http server...");
    server.close();
    console.log("shutting down...");
    Deno.exit(0);
});