export type UserLoginStruct = {
  username?: {
    type: string;
    fieldname: string;
    mimetype: string;
    encoding: string;
    value: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
    fields: unknown;
  };
  password?: {
    type: string;
    fieldname: string;
    mimetype: string;
    encoding: string;
    value: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
    fields: unknown;
  };
  client_secret?: {
    type: string;
    fieldname: string;
    mimetype: string;
    encoding: string;
    value: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
    fields: unknown;
  }
  refresh_token?: {
    type: string;
    fieldname: string;
    mimetype: string;
    encoding: string;
    value: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
    fields: unknown;
  }
}