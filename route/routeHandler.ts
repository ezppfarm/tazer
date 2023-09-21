import {
  RouteReply,
  RouteRequest,
} from "https://deno.land/x/rapid@v0.2.2/mod.ts";
import { RequestType } from "./requestType.ts";

export default interface routeHandler {
  path: string;
  requestTypes: RequestType[];
  handle(
    request: RouteRequest,
    response: RouteReply,
  ): Promise<unknown> | unknown;
}
