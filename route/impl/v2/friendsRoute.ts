import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../../requestType';
import routeHandler from '../../routeHandler';

export default class friendsRoute implements routeHandler {
  path = '/api/v2/friends';
  requestTypes = [RequestType.GET];
  handle(_request: FastifyRequest, response: FastifyReply): unknown {
    response.type('application/json');
    return [];
  }
}
