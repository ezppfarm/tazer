import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";
import { getDataFolder } from "../../glob";
import * as fs from 'fs';
import * as path from 'path';

export default class BaseRoute implements routeHandler {
  path = "/:id";
  requestTypes = [RequestType.GET];
  constraints = "avatar.ez-pp.farm"; //TODO: make dynamic
  async handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> {
    ;
    response.type("image/png");
    const pathParams = request.params as Record<string, unknown>;
    const id = pathParams["id"];
    const avatarFolder = getDataFolder("avatars");
    if (fs.existsSync(path.join(avatarFolder, `${id}.png`))) {
      return await fs.promises.readFile(path.join(avatarFolder, `${id}.png`));
    }
    response.code(400);
    return await fs.promises.readFile(path.join(avatarFolder, `0.png`));
  }
}
