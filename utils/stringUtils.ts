import { randomBytes } from "crypto";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789."; // memes

export const generateString = (length: number): string => {
  const charactersLength = characters.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes(1).readUInt8(0) % charactersLength;
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const generateBearerToken = () => generateString(255);
