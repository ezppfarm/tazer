import { FastifyReply } from "fastify";

export const grant_error = (response: FastifyReply, err: string) => {
  response.code(400);
  return {
    "error": "invalid_grant",
    "error_description":
      "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
    "hint": err,
    "message":
      "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
  };
};

export const success = (response: FastifyReply, obj: unknown) => {
  response.code(200);
  return obj;
};