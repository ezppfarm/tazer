import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";
import { authenticateUser, toSafeUsername } from "../../utils/userUtils";
import { refresh_tokens, sessions } from "../../repositories/session";
import { Session } from "../../objects/session";
import { generateBearerToken } from "../../utils/stringUtils";
import { UserLoginStruct } from "../../types/UserLoginStruct";
import * as responseUtils from '../../utils/responseUtils';

export default class oAuthRoute implements routeHandler {
  path = "/oauth/token";
  requestTypes = [RequestType.POST];
  async handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> {
    response.type("application/json");

    const loginRequest = request.body as UserLoginStruct;

    const username = loginRequest.username?.value;
    const password = loginRequest.password?.value;
    const refresh_token = loginRequest.refresh_token?.value;

    if (refresh_token) {
      const session = refresh_tokens.get<Session>(refresh_token);
      if (session) {
        session.expires_in = 86400;
        session.access_token = generateBearerToken();
        sessions.set(session.access_token, session, 86400);
        return session;
      } else return responseUtils.grant_error(response, "Invalid refresh token");
    }

    if (
      !username || !password || username.trim().length <= 0 || password.trim().length <= 0
    ) {
      return responseUtils.grant_error(response, "Invalid username and/or password");
    }
    const username_safe = toSafeUsername(username);
    //TODO: authenticate user

    const auth = await authenticateUser(username, password);

    if (!auth) {
      return responseUtils.grant_error(response, "Invalid username and/or password");
    }

    console.log("Creating session for", username_safe);
    const session: Session = {
      token_type: "Bearer",
      expires_in: 86400,
      access_token: generateBearerToken(),
      refresh_token: generateBearerToken(),
      id: auth.id,
      username: auth.username,
    };
    sessions.set(session.access_token, session, 86400);
    refresh_tokens.set(session.refresh_token, session);
    return responseUtils.success(response, session);
  }
}
