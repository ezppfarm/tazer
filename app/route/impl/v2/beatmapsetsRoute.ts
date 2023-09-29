import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../../requestType';
import routeHandler from '../../routeHandler';
import {getSessionToken} from '../../../repositories/session';
import fetch from 'node-fetch';

export default class beatmapsetsRoute implements routeHandler {
  path = '/api/v2/beatmapsets/:setid';
  requestTypes = [RequestType.GET];
  async handle(
    request: FastifyRequest,
    response: FastifyReply
  ): Promise<unknown> {
    response.type('application/json');
    const authorization_token = request.headers.authorization?.split(' ')[1];

    if (!authorization_token)
      return response.code(401).send({
        authentication: 'basic',
      });

    const session = getSessionToken(authorization_token);

    if (!session)
      return response.code(401).send({
        authentication: 'basic',
      });

    const pathParams = request.params as Record<string, unknown>;
    const id = pathParams['setid'];

    const fetchRequest = await fetch('https://osu.direct/api/v2/s/' + id);
    if (!fetchRequest.ok) return response.code(400).send({});
    const jsonRequest = await fetchRequest.json();
    return jsonRequest;
  }
}
