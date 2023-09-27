import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function createPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(
    crypto.createHash('md5').update(plainPassword).digest('hex'),
    10
  );
}

export async function comparePasswords(
  plainPassword: string,
  hashed_pw: string
): Promise<boolean> {
  return await bcrypt.compare(
    crypto.createHash('md5').update(plainPassword).digest('hex'),
    hashed_pw
  );
}
