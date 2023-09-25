import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";
import { toSafeUsername } from "../../utils/userUtils";
import { refresh_tokens, sessions } from "../../consts/cache";
import { Session } from "../../objects/session";
import { generateBearerToken } from "../../utils/stringUtils";

export default class oAuthRoute implements routeHandler {
  path = "/oauth/token";
  requestTypes = [RequestType.POST];
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");

    const error = (err: string) => {
      response.code(400);
      return {
        "error": "invalid_grant",
        "error_description":
          "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
        "hint": err,
        "message":
          "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
      };
    };

    const success = (obj: unknown) => {
      response.code(200);
      return obj;
    };

    const body = request.body as Record<string, string>;

    const username = body.username;
    const password = body.password;
    const refresh_token = body.refresh_token;

    if (refresh_token) {
      const session = refresh_tokens.get<Session>(refresh_token);
      if (session) {
        session.expires_in = 86400;
        session.access_token = generateBearerToken();
        sessions.set(session.access_token, session, 86400);
        return session;
      } else return error("Invalid refresh token");
    }

    if (
      !username || !password || username.length <= 0 || password.length <= 0
    ) {
      return error("Invalid username and/or password");
    }
    const username_safe = toSafeUsername(username || "");
    //TODO: authenticate user
    console.log("Creating session for", username_safe);
    const session: Session = {
      token_type: "Bearer",
      expires_in: 86400,
      access_token: generateBearerToken(),
      refresh_token: generateBearerToken(),
      id: 1,
      username: username_safe,
    };
    sessions.set(session.access_token, session, 86400);
    refresh_tokens.set(session.refresh_token, session);
    return success(session);
  }
}
