import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "./requestType";

export default interface routeHandler {
  path: string;
  requestTypes: RequestType[];
  constraints?: string;
  handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> | unknown;
}
