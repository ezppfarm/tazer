import NodeCache from 'node-cache';
import {Session} from '../objects/session';

const SESSIONS = new NodeCache();
const REFRESH_TOKENS = new NodeCache();

export const insertSessionToken = (session: Session) => {
  SESSIONS.set(session.access_token, session, 86400);
  if (!REFRESH_TOKENS.has(session.refresh_token))
    REFRESH_TOKENS.set(session.refresh_token, session);
};

export const getSessionToken = (token: string): Session | undefined => {
  return SESSIONS.get<Session>(token);
};

export const getSessionTokenFromRefreshToken = (
  refresh_token: string
): Session | undefined => {
  return REFRESH_TOKENS.get<Session>(refresh_token);
};
