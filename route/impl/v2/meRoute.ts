import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../../requestType";
import routeHandler from "../../routeHandler";
import { sessions } from "../../../repositories/session";
import { Session } from "../../../objects/session";
import { getUser } from "../../../repositories/user";

export default class meRoute implements routeHandler {
  path = "/api/v2/me/";
  requestTypes = [RequestType.GET];
  async handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> {
    response.type("application/json");
    const authorization_token = request.headers.authorization?.split(" ")[1];

    if (!authorization_token) return {
      Authorization: "Basic"
    };

    const session = sessions.get<Session>(authorization_token);

    if (!session) return {};

    const user = await getUser(session.id);

    if (!user) return {};
    return user;
  }
}
