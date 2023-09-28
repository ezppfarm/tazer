import {database} from '../../glob';
import {User} from '../objects/user';
import {DBUser} from '../types/DBUser';
import {comparePasswords} from './passwordUtils';

export const toSafeUsername = (username: string) => {
  return username.toLowerCase().replace(' ', '_');
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<undefined | User> => {
  const db = await database();
  if (!db) return undefined;
  const userQuery = await db('users').where('name', username).limit(1);
  if (!userQuery) return undefined;
  const selectedUser: DBUser = userQuery[0];
  const hashed_password = selectedUser.password;
  const validPassword = await comparePasswords(password, hashed_password);
  if (!validPassword) return undefined;
  return new User(selectedUser);
};
