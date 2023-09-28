export type Session = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
  id: number;
  username: string;
};
