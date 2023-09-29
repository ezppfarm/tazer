import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../../requestType';
import routeHandler from '../../routeHandler';
import {SESSIONS} from '../../../repositories/session';
import {Session} from '../../../objects/session';
import {getUser} from '../../../repositories/user';
import fetch from 'node-fetch';

export default class commentsRoute implements routeHandler {
  path = '/api/v2/comments';
  requestTypes = [RequestType.GET];
  async handle(
    _request: FastifyRequest,
    response: FastifyReply
  ): Promise<unknown> {
    response.type('application/json');
    return [];
  }
}
