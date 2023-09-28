import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../requestType';
import routeHandler from '../routeHandler';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import * as glob from '../../../glob';
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
    const avatarFolder = glob.getDataFolder('avatars');
    const requestedPath = path.join(avatarFolder, `${id}.png`);
    const exists = fs.existsSync(requestedPath);
    const imageBuffer = await fs.promises.readFile(
      path.join(avatarFolder, exists ? `${id}.png` : '0.png')
    );
    return await sharp(imageBuffer)
      .resize(128, 128, {
        kernel: 'lanczos3',
      })
      .toFormat('jpeg')
      .toBuffer();
  }
}
