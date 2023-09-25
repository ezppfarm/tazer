import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "./requestType";

export default interface routeHandler {
  path: string;
  requestTypes: RequestType[];
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> | unknown;
}
