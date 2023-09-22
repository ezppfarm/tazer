import { randomBytes } from "crypto";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.".split(""); // memes

export const generateString = (length: number): string => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters[randomBytes(1).readUInt8(0) % characters.length];
  }

  return result;
};

export const generateBearerToken = () => generateString(255);
