import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../../requestType";
import routeHandler from "../../routeHandler";
import { sessions } from "../../../repositories/session";
import { Session } from "../../../objects/session";
import { getUser } from "../../../repositories/user";

export default class friendsRoute implements routeHandler {
  path = "/api/v2/friends";
  requestTypes = [RequestType.GET];
  handle(
    _request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");
    return [];
  }
}
