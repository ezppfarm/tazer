import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";
import { toSafeUsername } from "../../utils/userUtils";
import { refresh_tokens, sessions } from "../../consts/cache";
import { Session } from "../../objects/session";
import { generateBearerToken } from "../../utils/stringUtils";

export default class oAuthRoute implements routeHandler {
  path = "/users";
  requestTypes = [RequestType.POST];
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");

    return {};
  }
}
