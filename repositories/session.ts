import NodeCache from "node-cache";

export const sessions = new NodeCache();
export const refresh_tokens = new NodeCache();
