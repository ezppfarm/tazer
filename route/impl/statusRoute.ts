import {
  RouteReply,
  RouteRequest,
} from "https://deno.land/x/rapid@v0.2.2/mod.ts";
import { RequestType } from "../requestType.ts";
import routeHandler from "../routeHandler.ts";

export default class BaseRoute implements routeHandler {
  path = "/";
  requestTypes = [RequestType.GET];
  handle(
    _request: RouteRequest,
    response: RouteReply,
  ): unknown {
    response.type("application/json");

    return {
      code: 200,
      message: "Hello World!",
    };
  }
}
