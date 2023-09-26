import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../../requestType";
import routeHandler from "../../routeHandler";
import { sessions } from "../../../repositories/session";
import { Session } from "../../../objects/session";
import { getUser } from "../../../repositories/user";

export default class seasonalBackgroundsRoute implements routeHandler {
  path = "/api/v2/seasonal-backgrounds";
  requestTypes = [RequestType.GET];
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): unknown {
    response.type("application/json");
    return {
      ends_at: "2022-09-01T16:00:00+00:00",
      backgrounds: [
        {
          url: "https://ez-pp.farm/assets/img/bg.jpg",
          user: {
            avatar_url: "https://a.ppy.sh/29265711.jpeg",
            country_code: "DE",
            default_group: "default",
            id: 29265711,
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: true,
            last_visit: "2022-07-11T14:48:13+00:00",
            pm_friends_only: false,
            profile_colour: null,
            username: "lILY1231"
          }
        }]
    };
  }
}
