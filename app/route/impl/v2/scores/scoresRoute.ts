import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../../../requestType';
import routeHandler from '../../../routeHandler';

export default class scoresRoute implements routeHandler {
  path = '/api/v2/beatmaps/:bid/solo-scores';
  requestTypes = [RequestType.GET];
  async handle(
    _request: FastifyRequest,
    response: FastifyReply
  ): Promise<unknown> {
    response.type('application/json');

    return [];
  }
}
