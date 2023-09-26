import { FastifyRequest } from "fastify";

export const getRequestIP = (req: FastifyRequest): string => {
  if ("cf-connecting-ip" in req.headers && req.headers['cf-connecting-ip'] != undefined)
    return req.headers['cf-connecting-ip'] as string;
  if ("x-real-ip" in req.headers && req.headers['x-real-ip'] != undefined)
    return req.headers['x-real-ip'] as string;
  return req.ip;
}