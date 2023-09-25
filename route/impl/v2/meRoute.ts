import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../../requestType";
import routeHandler from "../../routeHandler";

export default class meRoute implements routeHandler {
  path = "/api/v2/me";
  requestTypes = [RequestType.GET];
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");

    const authorization_token = request.headers.authorization?.split(" ")[1];
  
    return {};
  }
}
