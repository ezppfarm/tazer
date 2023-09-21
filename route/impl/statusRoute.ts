import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";

export default class BaseRoute implements routeHandler {
  path = "/";
  requestTypes = [RequestType.GET];
  handle(
    _request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");

    return {
      code: 200,
      message: "Hello World!",
    };
  }
}
