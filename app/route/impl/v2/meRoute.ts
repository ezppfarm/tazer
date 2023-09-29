import {FastifyReply, FastifyRequest} from 'fastify';
import {RequestType} from '../../requestType';
import routeHandler from '../../routeHandler';
import {getUser} from '../../../repositories/user';
import {getSessionToken} from '../../../repositories/session';

export default class meRoute implements routeHandler {
  path = '/api/v2/me/';
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

    const user = await getUser(session.id);

    if (!user) return {};
    return user;
  }
}
