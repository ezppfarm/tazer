import {FastifyRequest} from 'fastify';

export const getRequestIP = (req: FastifyRequest): string => {
  if (
    'cf-connecting-ip' in req.headers &&
    req.headers['cf-connecting-ip'] !== undefined
  )
    return (req.headers['cf-connecting-ip'] as string).trim();
  if ('x-real-ip' in req.headers && req.headers['x-real-ip'] !== undefined)
    return (req.headers['x-real-ip'] as string).trim();
  return req.ip.trim();
};
