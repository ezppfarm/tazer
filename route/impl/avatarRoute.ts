import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../requestType';
import routeHandler from '../routeHandler';
import {getDataFolder} from '../../glob';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import * as glob from '../../glob';
export default class BaseRoute implements routeHandler {
  path = '/:id';
  requestTypes = [RequestType.GET];
  constraints = glob.getDomain('avatar');
  async handle(
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<unknown> {
    response.type('image/png');
    const pathParams = request.params as Record<string, unknown>;
    const id = pathParams['id'];
    const avatarFolder = getDataFolder('avatars');
    if (fs.existsSync(path.join(avatarFolder, `${id}.png`))) {
      const imageBuffer = await fs.promises.readFile(
        path.join(avatarFolder, `${id}.png`)
      );
      const rescaled = await sharp(imageBuffer)
        .resize(128, 128)
        .toFormat('jpeg')
        .toBuffer();
      return rescaled;
    }
    response.code(400);
    return await fs.promises.readFile(path.join(avatarFolder, '0.png'));
  }
}
